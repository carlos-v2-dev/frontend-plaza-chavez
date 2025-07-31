
import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAppointments } from "@/hooks/useAppointments";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Swal from 'sweetalert2';

export function NotificationBell() {
  const navigate = useNavigate();
  const { data: appointments = [] } = useAppointments();
  const [newAppointments, setNewAppointments] = useState<number>(0);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  // Get latest 4 appointments
  const latestAppointments = appointments
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4);

  // Count new appointments since last check
  useEffect(() => {
    const newCount = appointments.filter(
      appointment => new Date(appointment.created_at) > lastChecked
    ).length;
    setNewAppointments(newCount);
  }, [appointments, lastChecked]);

  // Real-time subscription for new appointments
  useEffect(() => {
    const channel = supabase
      .channel('appointments-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'appointments'
        },
        (payload) => {
          setNewAppointments(prev => prev + 1);
          
          // Mostrar notificación con SweetAlert2
          Swal.fire({
            icon: 'info',
            title: 'Nueva Cita',
            text: `Nueva cita registrada para ${payload.new.user_name}`,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDropdownOpen = () => {
    setNewAppointments(0);
    setLastChecked(new Date());
  };

  const handleAppointmentClick = () => {
    navigate('/dashboard/calendar');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <DropdownMenu onOpenChange={handleDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          {newAppointments > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {newAppointments > 9 ? '9+' : newAppointments}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-white border shadow-lg">
        <DropdownMenuLabel className="font-semibold">
          Últimas Citas
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {latestAppointments.length === 0 ? (
          <DropdownMenuItem disabled>
            No hay citas recientes
          </DropdownMenuItem>
        ) : (
          latestAppointments.map((appointment) => (
            <DropdownMenuItem
              key={appointment.id}
              onClick={handleAppointmentClick}
              className="cursor-pointer hover:bg-gray-50 p-3"
            >
              <div className="flex flex-col space-y-1 w-full">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">{appointment.user_name}</span>
                  <span className="text-xs text-gray-500">
                    {formatDate(appointment.created_at)}
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  {new Date(appointment.appointment_date + 'T00:00:00').toLocaleDateString('es-ES')} - {appointment.appointment_times[0]}
                  {appointment.appointment_times.length > 1 && ` (+${appointment.appointment_times.length - 1})`}
                </div>
                <Badge 
                  variant="outline" 
                  className="text-xs w-fit"
                >
                  {appointment.status || 'Pendiente'}
                </Badge>
              </div>
            </DropdownMenuItem>
          ))
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleAppointmentClick}
          className="cursor-pointer text-center text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          Ver todas las citas
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
