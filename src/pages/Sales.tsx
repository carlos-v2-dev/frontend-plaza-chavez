
import { Layout } from "@/components/Layout";
import { InvoiceSystem } from "@/components/InvoiceSystem";
import { SalesHistory } from "@/components/SalesHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Sales = () => {
  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Ventas</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Sistema de facturación y gestión de ventas
          </p>
        </div>
        
        <Tabs defaultValue="new-sale" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-auto">
            <TabsTrigger 
              value="new-sale" 
              className="text-xs sm:text-sm py-2 sm:py-3"
            >
              Nueva Venta
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="text-xs sm:text-sm py-2 sm:py-3"
            >
              Historial de Ventas
            </TabsTrigger>
          </TabsList>
          <TabsContent value="new-sale" className="mt-4 sm:mt-6">
            <InvoiceSystem />
          </TabsContent>
          <TabsContent value="history" className="mt-4 sm:mt-6">
            <SalesHistory />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Sales;
