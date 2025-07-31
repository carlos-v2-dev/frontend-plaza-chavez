
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Search, Calendar as CalendarIcon, Clock } from "lucide-react";
import { useAppointments } from "@/hooks/useAppointments";
import { AppointmentModal } from "@/components/AppointmentModal";
import type { Appointment } from "@/hooks/useAppointments";
import Swal from 'sweetalert2';

const Calendar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: appointments = [], isLoading, error } = useAppointments();

  const filteredAppointments = appointments.filter(appointment =>
    appointment.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.payment_method.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const openModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAppointment(null);
    setIsModalOpen(false);
  };

  // Función para formatear fecha correctamente
  const formatDate = (dateString: string) => {
    try {
      // Crear fecha directamente del string de la base de datos
      const date = new Date(dateString + 'T00:00:00');
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  if (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Error al cargar las citas',
      confirmButtonColor: '#dc2626'
    });
    
    return (
      <Layout>
        <div className="text-red-500 text-sm sm:text-base p-4">
          Error al cargar las citas
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Agenda</h1>
            <p className="text-sm sm:text-base text-gray-600">
              Gestiona las citas y reservas
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por cliente, método de pago o estado..."
              className="pl-10 bg-gray-50 border-gray-200 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table - Responsive */}
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-6 sm:p-8 text-center text-sm sm:text-base">
              Cargando citas...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm min-w-[120px]">
                      CLIENTE
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm min-w-[100px]">
                      FECHA
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm min-w-[120px]">
                      HORARIOS
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm min-w-[100px]">
                      CANCHA
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm min-w-[80px]">
                      ESTADO
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm min-w-[80px]">
                      PAGO
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm min-w-[80px]">
                      ACCIONES
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-xs sm:text-sm">
                        <div className="truncate max-w-[120px]">
                          {appointment.user_name}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                          <span className="text-xs sm:text-sm">
                            {formatDate(appointment.appointment_date)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                          <div className="flex flex-wrap gap-1">
                            {appointment.appointment_times.slice(0, 1).map((time, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {time}
                              </Badge>
                            ))}
                            {appointment.appointment_times.length > 1 && (
                              <Badge variant="outline" className="text-xs">
                                +{appointment.appointment_times.length - 1}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 text-xs sm:text-sm">
                        <div className="truncate max-w-[100px]">
                          {appointment.courts?.name || 'No asignada'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${getStatusColor(appointment.status)}`}>
                          {appointment.status || 'Sin estado'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600 text-xs sm:text-sm">
                        <div className="truncate max-w-[80px]">
                          {appointment.payment_method}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openModal(appointment)}
                          className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Statistics - Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-3 sm:p-4 rounded-lg border shadow-sm">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500">Total Citas</h3>
            <p className="text-lg sm:text-2xl font-bold text-gray-900">{appointments.length}</p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg border shadow-sm">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500">Confirmadas</h3>
            <p className="text-lg sm:text-2xl font-bold text-green-600">
              {appointments.filter(a => a.status === 'confirmed').length}
            </p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg border shadow-sm">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500">Pendientes</h3>
            <p className="text-lg sm:text-2xl font-bold text-yellow-600">
              {appointments.filter(a => a.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg border shadow-sm">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500">Canceladas</h3>
            <p className="text-lg sm:text-2xl font-bold text-red-600">
              {appointments.filter(a => a.status === 'cancelled').length}
            </p>
          </div>
        </div>

        <AppointmentModal
          appointment={selectedAppointment}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      </div>
    </Layout>
  );
};

export default Calendar;
