
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Invoice {
  id: string;
  customer_name: string;
  customer_email: string | null;
  payment_reference: string | null;
  total: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  product_id: string | null;
  product_name: string;
  product_description: string | null;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
}

export const useInvoices = () => {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Invoice[];
    },
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (invoice: {
      customer_name: string;
      customer_email?: string;
      payment_reference?: string;
      total: number;
      items: {
        product_name: string;
        product_description?: string;
        quantity: number;
        unit_price: number;
        subtotal: number;
        product_id?: string;
      }[];
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      // Crear la factura
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .insert([{
          customer_name: invoice.customer_name,
          customer_email: invoice.customer_email,
          payment_reference: invoice.payment_reference,
          total: invoice.total,
          user_id: user.id,
        }])
        .select()
        .single();
      
      if (invoiceError) throw invoiceError;

      // Crear los items de la factura
      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(
          invoice.items.map(item => ({
            ...item,
            invoice_id: invoiceData.id,
          }))
        );
      
      if (itemsError) throw itemsError;
      
      return invoiceData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};
