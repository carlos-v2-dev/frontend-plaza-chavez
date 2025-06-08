
import { useState } from "react";
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
import { useCreateProduct } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";

interface CreateStateGoodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateStateGoodModal({ isOpen, onClose }: CreateStateGoodModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  
  const { data: categories = [] } = useCategories();
  const createProduct = useCreateProduct();

  const stateGoodsCategory = categories.find(cat => cat.name === "BIENES DEL ESTADO");

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("El nombre del producto es requerido");
      return;
    }

    if (!stateGoodsCategory) {
      toast.error("Categoría 'BIENES DEL ESTADO' no encontrada");
      return;
    }

    try {
      await createProduct.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
        price: price ? parseFloat(price) : undefined,
        category_id: stateGoodsCategory.id,
      });
      toast.success("Bien del estado creado exitosamente");
      handleClose();
    } catch (error) {
      toast.error("Error al crear el bien del estado");
      console.error(error);
    }
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setPrice("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo Bien del Estado</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Nombre</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del bien del estado"
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
              value="BIENES DEL ESTADO"
              disabled
              className="bg-gray-100 text-gray-500"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={createProduct.isPending}
          >
            {createProduct.isPending ? "Creando..." : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
