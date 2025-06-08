import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, FileText } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCreateInvoice } from "@/hooks/useInvoices";
import { toast } from "sonner";
import { ManualProductInput } from "./ManualProductInput";

interface InvoiceItem {
  id: number;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
  };
  quantity: number;
  subtotal: number;
}

export function InvoiceSystem() {
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [customerName, setCustomerName] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [paymentReference, setPaymentReference] = useState<string>("");

  const { data: products = [] } = useProducts();
  const createInvoice = useCreateInvoice();

  const addProductToInvoice = () => {
    if (!selectedProductId) return;

    const product = products.find(p => p.id === selectedProductId);
    if (!product || !product.price) return;

    const existingItem = invoiceItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      setInvoiceItems(invoiceItems.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity, subtotal: (item.quantity + quantity) * product.price! }
          : item
      ));
    } else {
      const newItem: InvoiceItem = {
        id: Date.now(),
        product: {
          id: product.id,
          name: product.name,
          description: product.description || '',
          price: product.price
        },
        quantity,
        subtotal: quantity * product.price
      };
      setInvoiceItems([...invoiceItems, newItem]);
    }

    setSelectedProductId("");
    setQuantity(1);
  };

  const addManualProductToInvoice = (product: {
    id: string;
    name: string;
    description: string;
    price: number;
  }, productQuantity: number) => {
    const newItem: InvoiceItem = {
      id: Date.now(),
      product,
      quantity: productQuantity,
      subtotal: productQuantity * product.price
    };
    setInvoiceItems([...invoiceItems, newItem]);
  };

  const removeItem = (itemId: number) => {
    setInvoiceItems(invoiceItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) return;
    
    setInvoiceItems(invoiceItems.map(item =>
      item.id === itemId
        ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.product.price }
        : item
    ));
  };

  const calculateTotal = () => {
    return invoiceItems.reduce((total, item) => total + item.subtotal, 0);
  };

  const generateInvoice = async () => {
    if (invoiceItems.length === 0 || !customerName) {
      toast.error("Por favor completa los datos del cliente y agrega productos");
      return;
    }
    
    try {
      await createInvoice.mutateAsync({
        customer_name: customerName,
        customer_email: customerEmail || undefined,
        payment_reference: paymentReference || undefined,
        total: calculateTotal(),
        items: invoiceItems.map(item => ({
          product_id: item.product.id.startsWith('manual-') ? undefined : item.product.id,
          product_name: item.product.name,
          product_description: item.product.description,
          quantity: item.quantity,
          unit_price: item.product.price,
          subtotal: item.subtotal,
        })),
      });
      
      toast.success("Factura generada exitosamente!");
      clearInvoice();
    } catch (error) {
      toast.error("Error al generar la factura");
      console.error(error);
    }
  };

  const clearInvoice = () => {
    setInvoiceItems([]);
    setCustomerName("");
    setCustomerEmail("");
    setPaymentReference("");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Información del Cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-semibold">Información del Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Cliente *
              </label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ingrese el nombre del cliente"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email (Opcional)
              </label>
              <Input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="cliente@email.com"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Referencia de Pago (Opcional)
              </label>
              <Input
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                placeholder="Ej: Transferencia #123456, Efectivo, etc."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selección de Productos Registrados */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-semibold">Seleccionar Producto Registrado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Producto
              </label>
              <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                <SelectTrigger>
                  <SelectValue placeholder="Buscar y seleccionar producto..." />
                </SelectTrigger>
                <SelectContent>
                  {products.filter(p => p.price).map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{product.name}</span>
                        <span className="text-sm text-gray-500">{product.description} - ${product.price?.toFixed(2)}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-24">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad
              </label>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>
            <Button
              onClick={addProductToInvoice}
              disabled={!selectedProductId}
              className="w-full sm:w-auto bg-red-500 hover:bg-red-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Agregar Producto Manual */}
      <ManualProductInput onAddProduct={addManualProductToInvoice} />

      {/* Tabla de Productos en la Factura */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-semibold">Productos en la Factura</CardTitle>
        </CardHeader>
        <CardContent>
          {invoiceItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay productos agregados a la factura
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Producto</TableHead>
                      <TableHead className="hidden sm:table-cell min-w-[150px]">Descripción</TableHead>
                      <TableHead className="min-w-[100px]">Precio Unit.</TableHead>
                      <TableHead className="min-w-[80px]">Cantidad</TableHead>
                      <TableHead className="min-w-[100px]">Subtotal</TableHead>
                      <TableHead className="min-w-[80px]">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoiceItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span className="text-sm">{item.product.name}</span>
                            {item.product.id.startsWith('manual-') && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded w-fit">
                                Manual
                              </span>
                            )}
                            <span className="text-xs text-gray-500 sm:hidden">
                              {item.product.description}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">{item.product.description}</TableCell>
                        <TableCell>${item.product.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-16 sm:w-20"
                          />
                        </TableCell>
                        <TableCell className="font-medium">${item.subtotal.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Totales */}
              <div className="border-t pt-4">
                <div className="flex justify-end">
                  <div className="w-full sm:w-80 space-y-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={clearInvoice}
                  className="w-full sm:w-auto"
                >
                  Limpiar Factura
                </Button>
                <Button 
                  onClick={generateInvoice}
                  disabled={createInvoice.isPending}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {createInvoice.isPending ? "Generando..." : "Generar Factura"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
