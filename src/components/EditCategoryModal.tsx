
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
import { useUpdateCategory } from "@/hooks/useCategories";
import { Category } from "@/hooks/useCategories";

interface EditCategoryModalProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditCategoryModal({ category, isOpen, onClose }: EditCategoryModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
  const updateCategory = useUpdateCategory();

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description || "");
    }
  }, [category]);

  const handleSave = async () => {
    if (!category) return;
    
    if (!name.trim()) {
      toast.error("El nombre de la categoría es requerido");
      return;
    }

    try {
      await updateCategory.mutateAsync({
        id: category.id,
        name: name.trim(),
        description: description.trim() || undefined,
      });
      toast.success("Categoría actualizada exitosamente");
      onClose();
    } catch (error) {
      toast.error("Error al actualizar la categoría");
      console.error(error);
    }
  };

  const handleClose = () => {
    onClose();
    if (category) {
      setName(category.name);
      setDescription(category.description || "");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Categoría</DialogTitle>
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
            disabled={updateCategory.isPending}
          >
            {updateCategory.isPending ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
