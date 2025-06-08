
import { useState } from "react";
import { useInvoices } from "@/hooks/useInvoices";
import { useSalesFilter } from "@/hooks/useSalesFilter";
import { SalesTable } from "./SalesTable";
import { SalesStatistics } from "./SalesStatistics";
import { DateFilter } from "./DateFilter";
import { Button } from "@/components/ui/button";
import { Download, Filter, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SalesHistory() {
  const { data: invoices = [], isLoading } = useInvoices();
  const {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    filteredInvoices,
    clearFilters,
    hasDateFilter
  } = useSalesFilter(invoices);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const exportToCSV = () => {
    const headers = ["Cliente", "Email", "Ref. Pago", "Total", "Fecha"];
    const csvContent = [
      headers.join(","),
      ...filteredInvoices.map(invoice => [
        `"${invoice.customer_name}"`,
        `"${invoice.customer_email || ""}"`,
        `"${invoice.payment_reference || ""}"`,
        invoice.total.toFixed(2),
        new Date(invoice.created_at).toLocaleDateString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ventas_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalSalesCount = filteredInvoices.length;
  const totalSales = filteredInvoices.reduce((sum, invoice) => sum + invoice.total, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      <SalesStatistics 
        totalSalesCount={totalSalesCount}
        totalSales={totalSales}
        hasDateFilter={hasDateFilter}
      />
      
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg sm:text-xl">
              Historial de Ventas
              {hasDateFilter && (
                <span className="ml-2 text-sm text-gray-500 font-normal">
                  ({filteredInvoices.length} resultados)
                </span>
              )}
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={exportToCSV}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                disabled={filteredInvoices.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <DateFilter
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onClearFilters={clearFilters}
            />
            {hasDateFilter && (
              <Button
                onClick={clearFilters}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
              >
                <X className="w-4 h-4 mr-2" />
                Limpiar Filtros
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <SalesTable invoices={filteredInvoices} />
        </CardContent>
      </Card>
    </div>
  );
}
