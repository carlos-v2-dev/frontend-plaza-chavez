    export interface TimeSlot {
        id: string;
        time: string;
        available: boolean;
    }
    
    export interface BookingData {
        selectedDate: Date | null;
        selectedTimes: string[];
        selectedCourt: string;
        userName: string;
        paymentMethod: 'efectivo' | 'pago_movil' | '';
        paymentProof?: File;
    }
    
    export interface CalendarDay {
        date: Date;
        isCurrentMonth: boolean;
        isSelected: boolean;
        isToday: boolean;
    }
    
    export interface Court {
        id: string;
        name: string;
        location?: string;
        description?: string;
        active?: boolean;
    }
    
    export interface Appointment {
        id?: string;
        court_id: string;
        user_name: string;
        appointment_date: string;
        appointment_times: string[];
        payment_method: 'efectivo' | 'pago_movil';
        payment_proof_url?: string | null;
        status?: string;
    }