
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface DateFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onClearFilters: () => void;
}

export function DateFilter({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange, 
  onClearFilters 
}: DateFilterProps) {
  return (
    <Card>
      <CardHeader className="px-3 sm:px-6">
        <CardTitle className="text-base sm:text-lg font-semibold">
          Filtros de Búsqueda
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Fecha inicio */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              Fecha Inicio
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
          </div>
          
          {/* Fecha fin */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              Fecha Fin
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
          </div>
          
          {/* Botón limpiar */}
          <div className="flex items-end sm:col-span-2 lg:col-span-1">
            <Button 
              variant="outline" 
              onClick={onClearFilters}
              className="w-full text-xs sm:text-sm"
              size="sm"
            >
              Limpiar Filtros
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
