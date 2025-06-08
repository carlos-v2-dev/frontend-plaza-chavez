import { Navigate, Outlet } from 'react-router-dom'

interface NavbarProps {
    token: string | null
}
function ProtectedRoute({token}: NavbarProps) {

    if(!token){
        return <Navigate to={"/login"} />
    }

    return (
        <Outlet />
    )
}

export default ProtectedRoute