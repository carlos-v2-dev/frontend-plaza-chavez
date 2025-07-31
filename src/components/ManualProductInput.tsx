
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface ManualProductInputProps {
  onAddProduct: (product: {
    id: string;
    name: string;
    description: string;
    price: number;
  }, quantity: number) => void;
}

export function ManualProductInput({ onAddProduct }: ManualProductInputProps) {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddManualProduct = () => {
    if (!productName || productPrice <= 0) return;

    const manualProduct = {
      id: `manual-${Date.now()}`, // ID temporal para productos manuales
      name: productName,
      description: productDescription,
      price: productPrice,
    };

    onAddProduct(manualProduct, quantity);
    
    // Limpiar el formulario
    setProductName("");
    setProductDescription("");
    setProductPrice(0);
    setQuantity(1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Agregar Producto Manual</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Producto *
            </label>
            <Input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Nombre del producto"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <Input
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder="Descripción del producto"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio *
            </label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={productPrice}
              onChange={(e) => setProductPrice(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </div>
          <div>
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
        </div>
        <div className="mt-4">
          <Button
            onClick={handleAddManualProduct}
            disabled={!productName || productPrice <= 0}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Producto Manual
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
