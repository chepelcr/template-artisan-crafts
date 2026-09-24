import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCartStore } from "@/store/cart";
import { generateWhatsAppMessage } from "@/lib/whatsapp";
import { whatsappPhone, whatsappUrl } from "@chepelcr/tsuru-storefront-sdk";
import { useContact } from "@/hooks/useContent";
import { useSubdomainContext } from "@/contexts/SubdomainContext";
import { getApiClient } from "@/lib/api";
import CheckoutAddress, {
  type AddressNames,
  type StructuredAddress,
} from "@/components/cart/checkout-address";

const EMPTY_ADDRESS: StructuredAddress = {
  state_id: null,
  county_id: null,
  district_id: null,
  neighborhood_id: null,
  address: "",
};

const EMPTY_NAMES: AddressNames = {
  state_name: "",
  county_name: "",
  district_name: "",
  neighborhood_name: "",
};

export default function CheckoutModal() {
  const { data: contact } = useContact();
  const { config } = useSubdomainContext();
  const [submitting, setSubmitting] = useState(false);
  const { showCheckout, setShowCheckout, items, total, clearCart } =
    useCartStore();

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    deliveryMethod: "",
  });
  const [address, setAddress] = useState<StructuredAddress>(EMPTY_ADDRESS);
  const [addressNames, setAddressNames] = useState<AddressNames>(EMPTY_NAMES);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const requiredFields = ["customerName", "customerPhone", "deliveryMethod"];

    const missingBasic = requiredFields.some(
      (field) => !formData[field as keyof typeof formData],
    );
    const missingAddress =
      address.state_id == null ||
      address.county_id == null ||
      address.district_id == null ||
      !address.address;

    if (missingBasic || missingAddress) {
      {
        alert("Por favor completa todos los campos");
        return;
      }
    }

    if (items.length === 0) {
      alert("No tienes productos en tu carrito");
      return;
    }

    // Generate WhatsApp message with location names
    // Place the order with the store first — same structured address
    // (provincia/cantón/distrito/barrio ids) as an internal order — then hand
    // its tracking number to WhatsApp. The WhatsApp tab opens now, inside the
    // click, so popup blockers let it through after the request.
    const storePhone = whatsappPhone(contact);
    const waWindow = storePhone ? window.open("", "_blank") : null;
    let trackingNumber: string | null = null;
    if (config && config.mode !== "demo" && config.orgId) {
      setSubmitting(true);
      try {
        const order = await getApiClient("prod", config.orgId).createOrder({
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          deliveryMethod: formData.deliveryMethod || null,
          address: {
            stateId: address.state_id,
            countyId: address.county_id,
            districtId: address.district_id,
            neighborhoodId: address.neighborhood_id,
            address: address.address,
          },
          items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
          comment: null,
        });
        trackingNumber = order.trackingNumber;
      } catch {
        waWindow?.close();
        alert("No pudimos registrar tu pedido. Intentá de nuevo en un momento.");
        return;
      } finally {
        setSubmitting(false);
      }
    }

    const message = generateWhatsAppMessage({
      items,
      total,
      customer: {
        name: formData.customerName,
        phone: formData.customerPhone,
      },
      delivery: {
        provincia: addressNames.state_name,
        canton: addressNames.county_name,
        distrito: addressNames.district_name,
        barrio: addressNames.neighborhood_name,
        address: address.address,
        method: formData.deliveryMethod,
      },
    });

    const handoff = trackingNumber ? `Pedido #${trackingNumber}\n\n${message}` : message;
    if (storePhone && waWindow) {
      waWindow.location.href = whatsappUrl(storePhone, handoff);
    } else if (trackingNumber) {
      alert(`Pedido #${trackingNumber} registrado. La tienda te contactará al ${formData.customerPhone}.`);
    } else {
      alert("Esta tienda todavía no configuró un número de WhatsApp para recibir pedidos.");
      return;
    }

    // Clear cart and close modal
    clearCart();
    setShowCheckout(false);

    // Reset form
    setFormData({
      customerName: "",
      customerPhone: "",
      deliveryMethod: "",
    });
    setAddress(EMPTY_ADDRESS);
    setAddressNames(EMPTY_NAMES);

    alert("Tu pedido ha sido enviado por WhatsApp");
  };

  return (
    <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Finalizar Compra
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h5 className="font-medium text-foreground mb-4">
              Información Personal
            </h5>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Nombre Completo</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) =>
                    handleInputChange("customerName", e.target.value)
                  }
                  placeholder="Tu nombre completo"
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">Teléfono</Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) =>
                    handleInputChange("customerPhone", e.target.value)
                  }
                  placeholder="8888-8888"
                  required
                />
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div>
            <h5 className="font-medium text-foreground mb-4">
              Información de Entrega
            </h5>
            <CheckoutAddress
              value={address}
              onChange={setAddress}
              onNamesChange={setAddressNames}
            />
            <div className="mt-4">
              <Label htmlFor="deliveryMethod">Método de Entrega</Label>
              <Select
                value={formData.deliveryMethod}
                onValueChange={(value) => handleInputChange("deliveryMethod", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="correos">Correos Costa Rica</SelectItem>
                  <SelectItem value="uber-flash">Uber Flash</SelectItem>
                  <SelectItem value="personal">Entrega Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center text-lg font-semibold mb-4">
              <span>Total del Pedido:</span>
              <span>${total.toLocaleString()}</span>
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-green-700 hover:bg-green-800 text-white py-4 px-6 h-auto font-medium transition-colors"
            >
              Enviar Pedido por WhatsApp
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
