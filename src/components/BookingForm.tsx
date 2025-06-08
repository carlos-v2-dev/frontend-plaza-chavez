    import React, { useState } from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Upload, X, User, CreditCard, Calendar, Clock, MapPin } from 'lucide-react';
    import { toast } from '@/hooks/use-toast';
    import { supabase } from '@/integrations/supabase/client';
    import { useCourts } from '@/hooks/useCourts';
    import type { Appointment } from '@/booking';

    interface BookingFormProps {
    selectedDate: Date | null;
    selectedTimes: string[];
    selectedCourt: string;
    onSubmit: (data: any) => void;
    }

    const BookingForm: React.FC<BookingFormProps> = ({
    selectedDate,
    selectedTimes,
    selectedCourt,
    onSubmit,
    }) => {
    const { courts } = useCourts();
    const [formData, setFormData] = useState({
        userName: '',
        paymentMethod: '',
        paymentProof: null as File | null,
    });

    const [dragActive, setDragActive] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const selectedCourtData = courts.find(court => court.id === selectedCourt);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedDate || selectedTimes.length === 0 || !selectedCourt) {
        toast({
            title: "Error",
            description: "Por favor selecciona una fecha, cancha y al menos un horario.",
            variant: "destructive",
        });
        return;
        }

        if (!formData.userName.trim()) {
        toast({
            title: "Error",
            description: "Por favor ingresa tu nombre.",
            variant: "destructive",
        });
        return;
        }

        if (!formData.paymentMethod) {
        toast({
            title: "Error",
            description: "Por favor selecciona un método de pago.",
            variant: "destructive",
        });
        return;
        }

        if (formData.paymentMethod === 'pago_movil' && !formData.paymentProof) {
        toast({
            title: "Error",
            description: "Por favor sube el comprobante de pago móvil.",
            variant: "destructive",
        });
        return;
        }

        setIsSubmitting(true);

        try {
        // Upload payment proof if provided
        let paymentProofUrl = null;
        if (formData.paymentProof) {
            const fileExt = formData.paymentProof.name.split('.').pop();
            const fileName = `payment-proof-${Date.now()}.${fileExt}`;
            
            const { data: uploadData, error: uploadError } = await supabase.storage
            .from('payment-proofs')
            .upload(fileName, formData.paymentProof);

            if (uploadError) {
            console.log('Upload error (storage bucket might not exist):', uploadError);
            // Continue without uploading if storage is not configured
            } else {
            paymentProofUrl = uploadData.path;
            }
        }

        // Create appointment record
        const appointmentData: Omit<Appointment, 'id'> = {
            court_id: selectedCourt,
            user_name: formData.userName,
            appointment_date: selectedDate.toISOString().split('T')[0],
            appointment_times: selectedTimes,
            payment_method: formData.paymentMethod as 'efectivo' | 'pago_movil',
            payment_proof_url: paymentProofUrl,
        };

        const { data, error } = await supabase
            .from('appointments')
            .insert([appointmentData])
            .select();

        if (error) throw error;

        onSubmit({
            selectedDate,
            selectedTimes,
            selectedCourt,
            userName: formData.userName,
            paymentMethod: formData.paymentMethod,
            paymentProof: formData.paymentProof,
        });
        
        toast({
            title: "¡Cita Agendada!",
            description: `Tu cita ha sido reservada para el ${selectedDate.toLocaleDateString()} en la cancha ${selectedCourtData?.name} en los horarios seleccionados.`,
        });

        // Reset form
        setFormData({
            userName: '',
            paymentMethod: '',
            paymentProof: null,
        });

        } catch (error) {
        console.error('Error creating appointment:', error);
        toast({
            title: "Error",
            description: "Hubo un problema al agendar tu cita. Por favor intenta nuevamente.",
            variant: "destructive",
        });
        } finally {
        setIsSubmitting(false);
        }
    };

    const handleFileUpload = (file: File) => {
        if (file && file.type.startsWith('image/')) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast({
            title: "Error",
            description: "El archivo debe ser menor a 5MB.",
            variant: "destructive",
            });
            return;
        }
        setFormData(prev => ({ ...prev, paymentProof: file }));
        } else {
        toast({
            title: "Error",
            description: "Por favor selecciona una imagen válida.",
            variant: "destructive",
        });
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
        } else if (e.type === "dragleave") {
        setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileUpload(e.dataTransfer.files[0]);
        }
    };

    const removeFile = () => {
        setFormData(prev => ({ ...prev, paymentProof: null }));
    };

    return (
        <Card className="shadow-xl border border-[#e4ebe1] rounded-2xl overflow-hidden transform transition-all duration-300 animate-in slide-in-from-bottom-4">
        <CardHeader className="bg-gradient-to-r from-[#e63946] to-[#d62835] text-white">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
            <User className="h-6 w-6" />
            Información de la Reserva
            </CardTitle>
        </CardHeader>
        <CardContent className="p-8 bg-white">
            <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
                <Label htmlFor="userName" className="text-gray-700 font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-[#e63946]" />
                Nombre Completo
                </Label>
                <Input
                id="userName"
                type="text"
                placeholder="Ingresa tu nombre completo"
                value={formData.userName}
                onChange={(e) => setFormData(prev => ({ ...prev, userName: e.target.value }))}
                className="w-full border-[#e4ebe1] focus:border-[#e63946] focus:ring-[#e63946] rounded-xl h-12 transition-all duration-200"
                />
            </div>

            <div className="space-y-4">
                <Label className="text-gray-700 font-semibold flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-[#e63946]" />
                Método de Pago
                </Label>
                <RadioGroup
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value, paymentProof: null }))}
                className="space-y-3"
                >
                <div className="flex items-center space-x-3 p-4 rounded-xl border border-[#e4ebe1] hover:bg-[#f1faee] transition-all duration-200 cursor-pointer">
                    <RadioGroupItem value="efectivo" id="efectivo" className="text-[#e63946]" />
                    <Label htmlFor="efectivo" className="cursor-pointer font-medium text-gray-700">
                    💵 Pago en Efectivo
                    </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 rounded-xl border border-[#e4ebe1] hover:bg-[#f1faee] transition-all duration-200 cursor-pointer">
                    <RadioGroupItem value="pago_movil" id="pago_movil" className="text-[#e63946]" />
                    <Label htmlFor="pago_movil" className="cursor-pointer font-medium text-gray-700">
                    📱 Pago Móvil
                    </Label>
                </div>
                </RadioGroup>
            </div>

            {formData.paymentMethod === 'pago_movil' && (
                <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                <Label className="text-gray-700 font-semibold">Comprobante de Pago Móvil</Label>
                <div
                    className={`
                    border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
                    ${dragActive 
                        ? 'border-[#e63946] bg-[#f1faee]' 
                        : 'border-[#e4ebe1] hover:border-[#e63946] hover:bg-[#f1faee]'
                    }
                    `}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    {formData.paymentProof ? (
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                        <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Upload className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="text-left">
                            <p className="font-semibold text-green-800">{formData.paymentProof.name}</p>
                            <p className="text-green-600 text-sm">
                            {(formData.paymentProof.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                        </div>
                        <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                        className="text-gray-500 hover:text-red-500 h-8 w-8 p-0"
                        >
                        <X className="w-4 h-4" />
                        </Button>
                    </div>
                    ) : (
                    <>
                        <Upload className="w-12 h-12 text-[#e63946] mx-auto mb-4" />
                        <p className="text-gray-600 mb-3 text-lg">
                        Arrastra la imagen aquí o{' '}
                        <label className="text-[#e63946] cursor-pointer hover:underline font-semibold">
                            selecciona un archivo
                            <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                            />
                        </label>
                        </p>
                        <p className="text-sm text-gray-500">
                        PNG, JPG hasta 5MB
                        </p>
                    </>
                    )}
                </div>
                </div>
            )}

            {selectedDate && selectedTimes.length > 0 && selectedCourt && (
                <div className="p-6 bg-gradient-to-r from-[#f1faee] to-[#e4ebe1] rounded-xl border border-[#e4ebe1] animate-in slide-in-from-bottom-4 duration-300">
                <h4 className="font-bold text-[#e63946] mb-4 text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Resumen de la Cita:
                </h4>
                <div className="space-y-2">
                    <p className="text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#e63946]" />
                    <strong>Fecha:</strong> {selectedDate.toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                    </p>
                    <p className="text-gray-700 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#e63946]" />
                    <strong>Cancha:</strong> {selectedCourtData?.name}
                    </p>
                    <p className="text-gray-700 flex items-start gap-2">
                    <Clock className="h-4 w-4 text-[#e63946] mt-0.5" />
                    <span><strong>Horarios:</strong> {selectedTimes.join(', ')}</span>
                    </p>
                </div>
                </div>
            )}

            <Button
                type="submit"
                className="w-full bg-[#e63946] hover:bg-[#d62835] text-white h-14 text-lg font-bold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedDate || selectedTimes.length === 0 || !selectedCourt || isSubmitting}
            >
                {isSubmitting ? 'Agendando...' : 'Agendar Cita'}
            </Button>
            </form>
        </CardContent>
        </Card>
    );
};

export default BookingForm;