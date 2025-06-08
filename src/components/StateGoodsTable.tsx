
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Edit, Trash2, Plus, Search } from "lucide-react";
import { useProducts, useDeleteProduct, Product } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { EditProductModal } from "./EditProductModal";
import { CreateStateGoodModal } from "./CreateStateGoodModal";
import { toast } from "sonner";

export function StateGoodsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();
  const deleteProduct = useDeleteProduct();

  // Filtrar solo productos de la categoría "BIENES DEL ESTADO"
  const stateGoodsCategory = categories.find(cat => cat.name === "BIENES DEL ESTADO");
  const stateGoods = products.filter(product => 
    product.category_id === stateGoodsCategory?.id &&
    (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este bien del estado?")) {
      try {
        await deleteProduct.mutateAsync(id);
        toast.success("Bien del estado eliminado exitosamente");
      } catch (error) {
        toast.error("Error al eliminar el bien del estado");
        console.error(error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bienes del Estado</h1>
          <p className="text-gray-600 mt-1">Gestiona los bienes pertenecientes al estado</p>
        </div>
        <Button 
          className="bg-red-500 hover:bg-red-600 text-white"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Bien del Estado
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar bienes del estado..."
            className="pl-10 bg-gray-50 border-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center">Cargando bienes del estado...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="font-semibold text-gray-700">PRODUCTO</TableHead>
                <TableHead className="font-semibold text-gray-700">DESCRIPCIÓN</TableHead>
                <TableHead className="font-semibold text-gray-700">PRECIO</TableHead>
                <TableHead className="font-semibold text-gray-700">ACCIONES</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stateGoods.map((product) => (
                <TableRow key={product.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-gray-600">{product.description || '-'}</TableCell>
                  <TableCell className="font-medium">
                    {product.price ? `$${product.price.toFixed(2)}` : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleDeleteProduct(product.id)}
                        disabled={deleteProduct.isPending}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Mostrando {stateGoods.length} bienes del estado
        </p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext 
                href="#"
                className="pointer-events-none opacity-50"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <EditProductModal
        product={editingProduct}
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
      />

      <CreateStateGoodModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}
