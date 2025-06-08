import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

interface MobileProtectedRouteProps {
  children: ReactNode;
  redirectPath?: string;
  fallback?: ReactNode;
}

const MobileProtectedRoute = ({
  children,
  redirectPath = '/not-mobile',
  fallback = null
}: MobileProtectedRouteProps, token) => {

    if(!token){
        return <Navigate to={"/login"} />
    }


  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkIfMobile = () => {
      // Detección mejorada que considera User Agent, touch events y tamaño de pantalla
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      
      setIsMobile((isMobileUserAgent && hasTouchScreen) || isSmallScreen);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Mostrar fallback mientras se determina el tipo de dispositivo
  if (isMobile === null) {
    return fallback;
  }

  if (!isMobile) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default MobileProtectedRoute;