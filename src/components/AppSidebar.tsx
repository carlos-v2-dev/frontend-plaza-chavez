
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Package, Tag, ShoppingCart, Calendar, Building, Building2, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { authService } from '../auth/authService';
import Swal from 'sweetalert2';

const menuItems = [
  {
    title: "Productos",
    icon: Package,
    url: "/dashboard/products",
  },
  {
    title: "Categorías",
    icon: Tag,
    url: "/dashboard/categories",
  },
  {
    title: "Ventas",
    icon: ShoppingCart,
    url: "/dashboard/sales",
  },
  {
    title: "Agenda",
    icon: Calendar,
    url: "/dashboard/calendar",
  },
  {
    title: "Bienes Propios",
    icon: Building,
    url: "/dashboard/own-goods",
  },
  {
    title: "Bienes del Estado",
    icon: Building2,
    url: "/dashboard/state-goods",
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const handleSignOut = async () => {
    Swal.fire({
      title: "Cerrar sesion",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si",
      cancelButtonText: "Cancelar"
      }).then(async (result) => {
      if (result.isConfirmed) {
          await authService.signOut()
          Swal.fire({
          text: "Sesion Cerrada!",
          icon: "success",
          showConfirmButton: false
      });
      window.location.reload()
      }
    });
};

  return (
    <Sidebar className="border-r bg-white" collapsible="icon">
      <SidebarContent>
        {/* Logo Section */}
        <div className={`p-4 border-b ${isCollapsed ? 'px-2' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0">
              <img src="/Sppj.png" alt="Logo secretaria" />
            </div>
            {!isCollapsed && (
              <span className="font-bold text-lg text-gray-800">PLAZA CHAVEZ</span>
            )}
          </div>
        </div>

        <SidebarGroup className={`px-2 py-4 ${isCollapsed ? 'px-1' : ''}`}>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      tooltip={isCollapsed ? item.title : undefined}
                      className={`w-full justify-start gap-3 px-3 py-3 ${
                        isActive 
                          ? 'bg-red-50 text-red-600 border-r-2 border-red-500' 
                          : 'text-gray-600 hover:bg-gray-50'
                      } ${isCollapsed ? 'justify-center px-2' : ''}`}
                    >
                      <Link to={item.url} className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && (
                          <span className="font-medium">{item.title}</span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout Section */}
        <div className={`mt-auto p-4 border-t ${isCollapsed ? 'px-2' : ''}`}>
          <SidebarMenuButton 
            onClick={handleSignOut}
            tooltip={isCollapsed ? "Cerrar Sesión" : undefined}
            className={`w-full justify-start gap-3 px-3 py-3 text-gray-600 hover:bg-gray-50 hover:text-red-600 cursor-pointer ${
              isCollapsed ? 'justify-center px-2' : ''
            }`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <span className="font-medium">Cerrar Sesión</span>
            )}
          </SidebarMenuButton>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
