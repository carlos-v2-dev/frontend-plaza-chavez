import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authService } from "@/auth/authService.ts"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { supabase } from "@/integrations/supabase/client"
import { Session } from "@/auth/authResponse"

export function LoginForm({ className, ...props}: React.ComponentPropsWithoutRef<"div">) {

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [session, setSession] = useState<Session>()

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            return setSession(session as Session)
            })
        
            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            return setSession(session as Session)
            })
        
            return () => subscription.unsubscribe()
    }, [])

    if(session){
        localStorage.setItem("user_id", session.user.id )
    }
    


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()

            const { error } = await authService.signInWithEmail(email, password)
            
            if (error) {
                return Swal.fire({
                    title: "Inicio Fallido!",
                    icon: "error",
                    text: `${error?.message}`,
                    showConfirmButton: false
                });
            }

            Swal.fire({
                title: "Inicio Exitoso!",
                icon: "success",
                showConfirmButton: false
            });

            window.location.href = "/dashboard/products"
    }

    return (
        <div className={cn("flex flex-col gap-4", className)} {...props}>
        <Card>
            <CardHeader className="text-center">
            <div className="flex justify-center">
                <img className="w-[55%] h-[250px]" src="/Sppj.png" alt="" />
                <img className="w-[55%] h-[250px]" src="/Venezuela Joven.png" alt="" />
            </div>
            <CardTitle className="text-xl">Bienvenido</CardTitle>
            <CardDescription>
                Sistema integrado de gestion de inventario
            </CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleLogin}>
                <div className="grid gap-6">
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Inicia Sesion
                    </span>
                </div>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                    <Label>Correo Electronico</Label>
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    </div>
                    <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label>Contrasena</Label>
                        <a
                        href="#"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                        Olvidaste tu contrasena?
                        </a>
                    </div>
                    <Input 
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    </div>
                    <Button type="submit" className="w-full bg-red-700 hover:bg-red-500">
                    Iniciar sesion
                    </Button>
                </div>
                </div>
            </form>
            </CardContent>
        </Card>
        <div className="text-balance text-center text-xs [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-secondary  ">
        Al hacer click en Entrar, aceptas nuestros <a href="#">Términos de servicio</a>{" "}
            y <a href="#">Política de privacidad</a>.
        </div>
        </div>
    )
}