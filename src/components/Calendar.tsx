import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CalendarDay } from '@/booking';

    interface CalendarProps {
    selectedDate: Date | null;
    onDateSelect: (date: Date) => void;
    currentMonth: Date;
    onMonthChange: (date: Date) => void;
    }

    const Calendar: React.FC<CalendarProps> = ({
    selectedDate,
    onDateSelect,
    currentMonth,
    onMonthChange,
    }) => {
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const dayNames = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

    const generateCalendarDays = (): CalendarDay[] => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        const days: CalendarDay[] = [];
        const today = new Date();
        
        for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        days.push({
            date,
            isCurrentMonth: date.getMonth() === month,
            isSelected: selectedDate ? date.toDateString() === selectedDate.toDateString() : false,
            isToday: date.toDateString() === today.toDateString(),
        });
        }
        
        return days;
    };

    const calendarDays = generateCalendarDays();

    const handlePrevMonth = () => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(newMonth.getMonth() - 1);
        onMonthChange(newMonth);
    };

    const handleNextMonth = () => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(newMonth.getMonth() + 1);
        onMonthChange(newMonth);
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-[#e4ebe1] transform transition-all duration-300 hover:shadow-2xl">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h2>
            <div className="flex gap-3">
            <Button
                variant="outline"
                size="sm"
                onClick={handlePrevMonth}
                className="h-10 w-10 p-0 border-[#e4ebe1] hover:bg-[#f1faee] hover:border-[#e63946] transition-all duration-200"
            >
                <ChevronLeft className="h-5 w-5 text-[#e63946]" />
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={handleNextMonth}
                className="h-10 w-10 p-0 border-[#e4ebe1] hover:bg-[#f1faee] hover:border-[#e63946] transition-all duration-200"
            >
                <ChevronRight className="h-5 w-5 text-[#e63946]" />
            </Button>
            </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-3">
            {dayNames.map((day) => (
            <div
                key={day}
                className="h-10 flex items-center justify-center text-sm font-semibold text-[#e63946] bg-[#f1faee] rounded-lg"
            >
                {day}
            </div>
            ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => {
            const isPast = day.date < new Date() && !day.isToday;
            const isDisabled = !day.isCurrentMonth || isPast;

            return (
                <button
                key={index}
                onClick={() => !isDisabled && onDateSelect(day.date)}
                disabled={isDisabled}
                className={`
                    h-12 w-12 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105
                    ${day.isSelected 
                    ? 'bg-[#e63946] text-white shadow-lg scale-105' 
                    : day.isToday
                    ? 'bg-[#f1faee] text-[#e63946] border-2 border-[#e63946] shadow-md'
                    : isDisabled
                    ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                    : 'text-gray-700 hover:bg-[#f1faee] hover:text-[#e63946] hover:shadow-md'
                    }
                    ${!day.isCurrentMonth ? 'opacity-40' : ''}
                `}
                >
                {day.date.getDate()}
                </button>
            );
            })}
        </div>
        </div>
    );
    };

    export default Calendar;