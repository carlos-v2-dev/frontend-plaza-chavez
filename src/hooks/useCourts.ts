    import { useState, useEffect } from 'react';
    import { supabase } from '@/integrations/supabase/client';
    import type { Court } from '@/booking';
    import { toast } from '@/hooks/use-toast';

    export const useCourts = () => {
    const [courts, setCourts] = useState<Court[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCourts();
    }, []);

    const fetchCourts = async () => {
        try {
        setLoading(true);
        const { data, error } = await supabase
            .from('courts')
            .select('*')
            .eq('active', true)
            .order('name');

        if (error) throw error;

        setCourts(data || []);
        } catch (err) {
        console.error('Error fetching courts:', err);
        setError('Error al cargar las canchas');
        toast({
            title: "Error",
            description: "No se pudieron cargar las canchas disponibles.",
            variant: "destructive",
        });
        } finally {
        setLoading(false);
        }
    };

    return { courts, loading, error, refetch: fetchCourts };
    };