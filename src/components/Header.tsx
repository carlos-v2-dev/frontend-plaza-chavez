import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Menu, X } from "lucide-react";
import { NotificationBell } from "./NotificationBell";
import { useSidebar } from "@/components/ui/sidebar";
import { authService } from "@/auth/authService";
import { Session } from "@/auth/authResponse";

export function Header() {
  const [session, setSession] = useState<Session>();
  const { toggleSidebar, open } = useSidebar();

  useEffect(() => {
    const getSession = new Promise(resolve => {
      resolve(authService.getSession())
    })

    getSession
      .then(res => {
        setSession(res.session as Session)
      })
      .catch(error => {
        console.log(error);
      })
  },[])

  const user = session ? session.user : ""
  const email = user ? user.email : ""
  
  

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
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <NotificationBell />
              <div className="hidden sm:flex items-center gap-2 sm:gap-3 min-w-0">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600 truncate max-w-32 md:max-w-40 lg:max-w-none">
                  { email }
                </span>
              </div>
              <Avatar className="w-8 h-8 sm:hidden flex-shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary">
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
          </div>
      </div>
    </header>
  );
}
