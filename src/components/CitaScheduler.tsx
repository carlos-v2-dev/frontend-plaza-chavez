import React, { useState } from 'react';
import Calendar from './Calendar';
import TimeSlots from './TimeSlots';
import BookingForm from './BookingForm';
import { CalendarDays, Clock } from 'lucide-react';

    const CitaScheduler = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
    const [selectedCourt, setSelectedCourt] = useState<string>('');
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setSelectedTimes([]); // Clear selected times when changing date
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTimes(prev => {
        if (prev.includes(time)) {
            return prev.filter(t => t !== time);
        } else {
            return [...prev, time].sort();
        }
        });
    };

    const handleCourtSelect = (courtId: string) => {
        setSelectedCourt(courtId);
        setSelectedTimes([]); // Clear selected times when changing court
    };

    const handleBookingSubmit = (bookingData: any) => {
        console.log('Booking submitted:', bookingData);
        
        // Reset selections after successful booking
        setSelectedDate(null);
        setSelectedTimes([]);
        setSelectedCourt('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f1faee] via-white to-[#e4ebe1] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 animate-in slide-in-from-top-6 duration-500">
            <div className="flex items-center justify-center gap-3 mb-4">
                <CalendarDays className="h-10 w-10 text-[#e63946]" />
                <h1 className="text-4xl font-bold text-gray-800">
                Sistema de Agendamiento
                </h1>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Selecciona tu fecha y horario preferido para reservar tu cita de manera fácil y rápida
            </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar Section */}
            <div className="lg:col-span-1 animate-in slide-in-from-left-6 duration-500 delay-100">
                <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <CalendarDays className="h-6 w-6 text-[#e63946]" />
                    <h2 className="text-2xl font-bold text-gray-800">
                    Selecciona la Fecha
                    </h2>
                </div>
                <Calendar
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                    currentMonth={currentMonth}
                    onMonthChange={setCurrentMonth}
                />
                </div>
            </div>

            {/* Time Slots and Form Section */}
            <div className="lg:col-span-2 animate-in slide-in-from-right-6 duration-500 delay-200">
                <div className="space-y-8">
                {selectedDate && (
                    <TimeSlots
                    selectedDate={selectedDate}
                    selectedTimes={selectedTimes}
                    selectedCourt={selectedCourt}
                    onTimeSelect={handleTimeSelect}
                    onCourtSelect={handleCourtSelect}
                    />
                )}

                {selectedDate && selectedCourt && selectedTimes.length > 0 && (
                    <BookingForm
                    selectedDate={selectedDate}
                    selectedTimes={selectedTimes}
                    selectedCourt={selectedCourt}
                    onSubmit={handleBookingSubmit}
                    />
                )}
                </div>
            </div>
            </div>
        </div>
        </div>
    );
    };

    export default CitaScheduler;