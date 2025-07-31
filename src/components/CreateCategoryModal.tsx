
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
import { useCreateCategory } from "@/hooks/useCategories";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCategoryModal({ isOpen, onClose }: CreateCategoryModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
  const createCategory = useCreateCategory();

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("El nombre de la categoría es requerido");
      return;
    }

    try {
      await createCategory.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
      });
      toast.success("Categoría creada exitosamente");
      handleClose();
    } catch (error) {
      toast.error("Error al crear la categoría");
      console.error(error);
    }
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva Categoría</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Nombre</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre de la categoría"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Descripción</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción (opcional)"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={createCategory.isPending}
          >
            {createCategory.isPending ? "Creando..." : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
