
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Invoice } from "@/hooks/useInvoices";

interface SalesTableProps {
  invoices: Invoice[];
}

export function SalesTable({ invoices }: SalesTableProps) {
  if (invoices.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No se encontraron ventas en el período seleccionado
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[120px]">Cliente</TableHead>
            <TableHead className="hidden sm:table-cell min-w-[180px]">Email</TableHead>
            <TableHead className="hidden md:table-cell min-w-[140px]">Ref. Pago</TableHead>
            <TableHead className="min-w-[100px]">Total</TableHead>
            <TableHead className="min-w-[120px]">Fecha</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span className="text-sm">{invoice.customer_name}</span>
                  <span className="text-xs text-gray-500 sm:hidden">
                    {invoice.customer_email || "Sin email"}
                  </span>
                  <span className="text-xs text-gray-500 md:hidden">
                    {invoice.payment_reference && (
                      <Badge variant="outline" className="text-xs mt-1">
                        {invoice.payment_reference}
                      </Badge>
                    )}
                  </span>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {invoice.customer_email || (
                  <span className="text-gray-400 italic">Sin email</span>
                )}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {invoice.payment_reference ? (
                  <Badge variant="outline" className="text-sm">
                    {invoice.payment_reference}
                  </Badge>
                ) : (
                  <span className="text-gray-400 italic">Sin referencia</span>
                )}
              </TableCell>
              <TableCell className="font-medium text-green-600">
                ${invoice.total.toFixed(2)}
              </TableCell>
              <TableCell className="text-sm">
                {format(new Date(invoice.created_at), "dd/MM/yyyy HH:mm", {
                  locale: es,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
