import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TimeSlot } from '@/booking';
import { Clock, MapPin } from 'lucide-react';
import { useCourts } from '@/hooks/useCourts';
import { useAvailability } from '@/hooks/useAvailability';

interface TimeSlotsProps {
selectedDate: Date | null;
selectedTimes: string[];
selectedCourt: string;
onTimeSelect: (time: string) => void;
onCourtSelect: (courtId: string) => void;
}

const TimeSlots: React.FC<TimeSlotsProps> = ({
selectedDate,
selectedTimes,
selectedCourt,
onTimeSelect,
onCourtSelect,
}) => {
    const { courts, loading: courtsLoading } = useCourts();
    const { unavailableTimes, loading: availabilityLoading } = useAvailability(selectedCourt, selectedDate);

    const generateTimeSlots = (): TimeSlot[] => {
        const slots: TimeSlot[] = [];
        const startHour = 16; // 5:00 PM
        const endHour = 24; // 12:00 AM (midnight)
        
        for (let hour = startHour; hour <= endHour; hour++) {
        const displayTime = hour > 12 
            ? `${hour - 12}:00pm`
            : hour === 12
            ? `12:00pm`
            : `${hour}:00am`;
        
        const isUnavailable = unavailableTimes.includes(displayTime);
        
        slots.push({
            id: `${hour}-00`,
            time: displayTime,
            available: !isUnavailable,
        });
        }
        
        return slots;
    };

    const timeSlots = generateTimeSlots();
    const selectedCourtData = courts.find(court => court.id === selectedCourt);

    if (!selectedDate) {
        return null;
    }

    const formatSelectedDate = (date: Date) => {
        const days = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
        const months = [
        'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
        'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'
        ];
        
        return {
        dayName: days[date.getDay()],
        day: date.getDate(),
        month: months[date.getMonth()],
        };
};

    const dateInfo = formatSelectedDate(selectedDate);

    return (
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-[#e4ebe1] transform transition-all duration-300 animate-in slide-in-from-bottom-4">
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-[#e63946]" />
            <h3 className="text-xl font-bold text-gray-800">
                Selecciona la Cancha y Horarios
            </h3>
            </div>
            <div className="text-sm text-gray-500 bg-[#f1faee] px-3 py-1 rounded-full">
            (GMT-04:00) Hora de Venezuela
            </div>
        </div>

        <div className="mb-6">
            <div className="inline-flex items-center gap-4 bg-[#f1faee] px-6 py-3 rounded-xl border border-[#e4ebe1]">
            <div className="text-center">
                <div className="text-xs text-[#e63946] font-semibold mb-1">{dateInfo.dayName}</div>
                <div className="text-2xl font-bold text-gray-800">{dateInfo.day}</div>
                <div className="text-xs text-gray-600">{dateInfo.month}</div>
            </div>
            </div>
        </div>

        {/* Court Selection */}
        <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-[#e63946]" />
            <h4 className="text-lg font-semibold text-gray-800">Selecciona la Cancha</h4>
            </div>
            <Select value={selectedCourt} onValueChange={onCourtSelect} disabled={courtsLoading}>
            <SelectTrigger className="w-full h-12 border-[#e4ebe1] focus:border-[#e63946] focus:ring-[#e63946] rounded-xl">
                <SelectValue placeholder={courtsLoading ? "Cargando canchas..." : "Selecciona una cancha"} />
            </SelectTrigger>
            <SelectContent className="bg-white border-[#e4ebe1] rounded-xl shadow-lg">
                {courts.map((court) => (
                <SelectItem 
                    key={court.id} 
                    value={court.id}
                    className="hover:bg-[#f1faee] focus:bg-[#f1faee] rounded-lg m-1"
                >
                    <div className="flex flex-col items-start">
                    <span className="font-medium">{court.name}</span>
                    {court.location && (
                        <span className="text-sm text-gray-500">{court.location}</span>
                    )}
                    </div>
                </SelectItem>
                ))}
            </SelectContent>
            </Select>
            
            {selectedCourtData && (
            <div className="mt-3 p-3 bg-gradient-to-r from-[#f1faee] to-[#e4ebe1] rounded-lg">
                <p className="text-sm text-gray-700">
                <strong>Cancha:</strong> {selectedCourtData.name}
                </p>
                {selectedCourtData.description && (
                <p className="text-sm text-gray-600 mt-1">{selectedCourtData.description}</p>
                )}
            </div>
            )}
        </div>

        {/* Time Slots - Only show if court is selected */}
        {selectedCourt && (
            <>
            {availabilityLoading ? (
                <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e63946] mx-auto"></div>
                <p className="text-gray-500 mt-2">Verificando disponibilidad...</p>
                </div>
            ) : (
                <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
                    {timeSlots.map((slot) => {
                    const isSelected = selectedTimes.includes(slot.time);
                    
                    return (
                        <Button
                        key={slot.id}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => slot.available && onTimeSelect(slot.time)}
                        disabled={!slot.available}
                        className={`
                            h-14 transition-all duration-300 transform hover:scale-105 font-medium text-sm
                            ${isSelected 
                            ? 'bg-[#e63946] hover:bg-[#d62835] text-white shadow-lg border-[#e63946] scale-105' 
                            : slot.available
                            ? 'border-[#e4ebe1] hover:border-[#e63946] hover:bg-[#f1faee] hover:text-[#e63946] text-gray-700'
                            : 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                            }
                        `}
                        >
                        {slot.time}
                        {!slot.available && (
                            <span className="block text-xs mt-1">No disponible</span>
                        )}
                        </Button>
                    );
                    })}
                </div>

                {selectedTimes.length > 0 && (
                    <div className="bg-gradient-to-r from-[#f1faee] to-[#e4ebe1] p-6 rounded-xl border border-[#e4ebe1] animate-in slide-in-from-bottom-4 duration-300">
                    <h4 className="font-bold text-[#e63946] mb-3 text-lg">
                        Horarios Seleccionados ({selectedTimes.length}):
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {selectedTimes.map((time) => (
                        <span
                            key={time}
                            className="px-4 py-2 bg-white text-[#e63946] rounded-full text-sm font-semibold shadow-md border border-[#e4ebe1] transform transition-all duration-200 hover:scale-105"
                        >
                            {time}
                        </span>
                        ))}
                    </div>
                    </div>
                )}
                </>
            )}
            </>
        )}

        {selectedCourt && !availabilityLoading && selectedTimes.length === 0 && (
            <div className="text-center py-8">
            <Clock className="h-12 w-12 text-[#e63946] opacity-50 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
                Selecciona uno o más horarios para continuar
            </p>
            </div>
        )}
        </div>
    );
    };

    export default TimeSlots;