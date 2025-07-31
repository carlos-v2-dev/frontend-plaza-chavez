
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useUpdateProduct } from "@/hooks/useProducts";
import { Product } from "@/hooks/useProducts";

interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditProductModal({ product, isOpen, onClose }: EditProductModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  
  const updateProduct = useUpdateProduct();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description || "");
      setPrice(product.price ? product.price.toString() : "");
    }
  }, [product]);

  const handleSave = async () => {
    if (!product) return;
    
    if (!name.trim()) {
      toast.error("El nombre del producto es requerido");
      return;
    }

    try {
      await updateProduct.mutateAsync({
        id: product.id,
        name: name.trim(),
        description: description.trim() || undefined,
        price: price ? parseFloat(price) : undefined,
      });
      toast.success("Producto actualizado exitosamente");
      onClose();
    } catch (error) {
      toast.error("Error al actualizar el producto");
      console.error(error);
    }
  };

  const handleClose = () => {
    onClose();
    if (product) {
      setName(product.name);
      setDescription(product.description || "");
      setPrice(product.price ? product.price.toString() : "");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Producto</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Nombre</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del producto"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Descripción</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Precio</label>
            <Input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Precio"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Categoría</label>
            <Input
              value={product?.categories?.name || '-'}
              disabled
              className="bg-gray-100 text-gray-500"
            />
            <p className="text-xs text-gray-500 mt-1">La categoría no puede ser modificada</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={updateProduct.isPending}
          >
            {updateProduct.isPending ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
