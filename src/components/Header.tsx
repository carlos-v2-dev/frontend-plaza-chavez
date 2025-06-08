
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { NotificationBell } from "./NotificationBell";
import { useSidebar } from "@/components/ui/sidebar";

export function Header() {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { toggleSidebar, open } = useSidebar();

  return (
    <header className="border-b bg-white sticky top-0 z-40 shadow-sm">
      <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 md:px-6 max-w-full">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-gray-100 flex-shrink-0"
          >
            {open ? (
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
          <h1 className="text-lg sm:text-xl font-semibold truncate min-w-0">
            Sistema de Gestión
          </h1>
        </div>
      </div>
    </header>
  );
}
