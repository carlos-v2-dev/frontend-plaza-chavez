
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, CreditCard, MapPin, Bug } from "lucide-react";
import { Appointment } from "@/hooks/useAppointments";
import { useStorageImage } from "@/hooks/useStorageImage";
import Swal from 'sweetalert2';
import { useState } from "react";

interface AppointmentModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AppointmentModal({ appointment, isOpen, onClose }: AppointmentModalProps) {
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  
  // Intentar múltiples formatos de imagen
  const paymentImageFileName = appointment?.payment_proof_url ? `${appointment.payment_proof_url}` : null;
  const { imageUrl, loading: imageLoading, error: imageError, debugInfo } = useStorageImage(
    'payment-proofs', 
    paymentImageFileName
  );

  console.log(imageUrl);
  



  if (!appointment) return null;

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

  // Función para formatear fecha correctamente
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString + 'T00:00:00');
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const handleImageError = () => {
    Swal.fire({
      icon: 'warning',
      title: 'Imagen no disponible',
      text: 'No se pudo cargar el comprobante de pago',
      confirmButtonColor: '#dc2626'
    });
  };

  const toggleDebugInfo = () => {
    setShowDebugInfo(!showDebugInfo);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Detalles de la Cita
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDebugInfo}
              className="h-6 w-6 p-0"
              title="Toggle debug info"
            >
              <Bug className="w-3 h-3" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="font-medium">Estado:</span>
            <Badge className={getStatusColor(appointment.status)}>
              {appointment.status || 'No especificado'}
            </Badge>
          </div>

          {/* User Name */}
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-sm text-gray-500">Cliente:</span>
              <p className="font-medium truncate">{appointment.user_name}</p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-sm text-gray-500">Fecha:</span>
              <p className="font-medium">
                {formatDate(appointment.appointment_date)}
              </p>
            </div>
          </div>

          {/* Times */}
          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-sm text-gray-500">Horarios:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {appointment.appointment_times.map((time, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {time}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Court */}
          {appointment.courts?.name && (
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-sm text-gray-500">Cancha:</span>
                <p className="font-medium truncate">{appointment.courts.name}</p>
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div className="flex items-center gap-3">
            <CreditCard className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-sm text-gray-500">Método de pago:</span>
              <p className="font-medium truncate">{appointment.payment_method}</p>
            </div>
          </div>

          {/* Payment Proof Image */}
          <div className="border rounded-lg p-3">
            <span className="text-sm text-gray-500">Comprobante de pago:</span>
            <div className="mt-2">
              {imageLoading ? (
                <div className="w-full h-48 bg-gray-100 rounded-md border flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Cargando imagen...</span>
                </div>
              ) : imageUrl ? (
                <div>
                  <img 
                    src={imageUrl} 
                    alt="Comprobante de pago"
                    className="w-full h-48 object-cover rounded-md border mb-2"
                    onError={handleImageError}
                  />
                  {showDebugInfo && (
                    <div className="text-xs text-gray-500 break-all space-y-1">
                      <div><strong>URL encontrada:</strong> {imageUrl}</div>
                      <div><strong>ID de cita:</strong> {appointment.id}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded-md border flex items-center justify-center">
                  <span className="text-gray-500 text-sm text-center px-2">
                    {imageError || 'No hay comprobante disponible'}
                  </span>
                </div>
              )}
            </div>

            {/* Debug Information */}
            {showDebugInfo && (
              <div className="mt-3 p-2 bg-gray-50 rounded text-xs space-y-2">
                <div><strong>Debug Info:</strong></div>
                <div><strong>Bucket:</strong> payment-proofs</div>
                <div><strong>Filename buscado:</strong> {debugInfo.fileName}</div>
                <div><strong>Bucket existe:</strong> {debugInfo.bucketExists ? 'Sí' : 'No'}</div>
                <div><strong>URLs intentadas:</strong></div>
                <div className="pl-2 space-y-1">
                  {debugInfo.attemptedUrls.map((url, index) => (
                    <div key={index} className="break-all">
                      {index + 1}. {url}
                    </div>
                  ))}
                </div>
                {imageError && (
                  <div className="text-red-600">
                    <strong>Error:</strong> {imageError}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Created At */}
          <div className="text-xs text-gray-500 pt-2 border-t">
            Creado: {new Date(appointment.created_at).toLocaleString('es-ES')}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
