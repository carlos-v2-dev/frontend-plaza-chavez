import { ReactNode } from "react";

interface LayoutProps {
    children: ReactNode;
    }

function PrincipalLayout({children}: LayoutProps) {
    return (
        <div className="fondo">
            {children}
        </div>
        
    )
    }
export default PrincipalLayout