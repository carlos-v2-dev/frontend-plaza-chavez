
import { useState, useMemo } from "react";
import { Invoice } from "./useInvoices";

export function useSalesFilter(invoices: Invoice[]) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {
      let matchesDateRange = true;
      if (startDate || endDate) {
        const invoiceDate = new Date(invoice.created_at);
        if (startDate) {
          const start = new Date(startDate);
          matchesDateRange = matchesDateRange && invoiceDate >= start;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          matchesDateRange = matchesDateRange && invoiceDate <= end;
        }
      }
      return matchesDateRange;
    });
  }, [invoices, startDate, endDate]);

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
  };

  return {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    filteredInvoices,
    clearFilters,
    hasDateFilter: Boolean(startDate || endDate)
  };
}
