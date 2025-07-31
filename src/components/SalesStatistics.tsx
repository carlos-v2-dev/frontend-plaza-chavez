
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SalesStatisticsProps {
  totalSalesCount: number;
  totalSales: number;
  hasDateFilter: boolean;
}

export function SalesStatistics({ totalSalesCount, totalSales, hasDateFilter }: SalesStatisticsProps) {
  const averageSale = totalSalesCount > 0 ? (totalSales / totalSalesCount) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      <Card className="min-w-0">
        <CardHeader className="pb-2 px-3 sm:px-6">
          <CardTitle className="text-xs sm:text-sm font-medium text-gray-500 truncate">
            {hasDateFilter ? "Ventas en Rango" : "Total Ventas"}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <div className="text-xl sm:text-2xl font-bold">{totalSalesCount}</div>
        </CardContent>
      </Card>
      
      <Card className="min-w-0">
        <CardHeader className="pb-2 px-3 sm:px-6">
          <CardTitle className="text-xs sm:text-sm font-medium text-gray-500 truncate">
            {hasDateFilter ? "Ingresos en Rango" : "Ingresos Totales"}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <div className="text-xl sm:text-2xl font-bold text-green-600">
            ${totalSales.toFixed(2)}
          </div>
        </CardContent>
      </Card>
      
      <Card className="min-w-0 sm:col-span-2 lg:col-span-1">
        <CardHeader className="pb-2 px-3 sm:px-6">
          <CardTitle className="text-xs sm:text-sm font-medium text-gray-500 truncate">
            Promedio por Venta
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <div className="text-xl sm:text-2xl font-bold">${averageSale.toFixed(2)}</div>
        </CardContent>
      </Card>
    </div>
  );
}
