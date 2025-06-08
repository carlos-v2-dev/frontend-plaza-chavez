    import { useState, useEffect } from 'react';
    import { supabase } from '@/integrations/supabase/client';

    export const useAvailability = (courtId: string, date: Date | null) => {
    const [unavailableTimes, setUnavailableTimes] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (courtId && date) {
        checkAvailability(courtId, date);
        } else {
        setUnavailableTimes([]);
        }
    }, [courtId, date]);

    const checkAvailability = async (courtId: string, date: Date) => {
        try {
        setLoading(true);
        const dateString = date.toISOString().split('T')[0];
        
        const { data, error } = await supabase
            .from('appointments')
            .select('appointment_times')
            .eq('court_id', courtId)
            .eq('appointment_date', dateString)
            .neq('status', 'cancelled');

        if (error) throw error;

        const bookedTimes = data?.flatMap(appointment => appointment.appointment_times) || [];
        setUnavailableTimes(bookedTimes);
        } catch (error) {
        console.error('Error checking availability:', error);
        setUnavailableTimes([]);
        } finally {
        setLoading(false);
        }
    };

    return { unavailableTimes, loading };
    };