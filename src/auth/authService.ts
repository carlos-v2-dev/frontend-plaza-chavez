import { AuthResponse, Session } from "./authResponse"
import { supabase } from "@/integrations/supabase/client"


export const authService = {
  // Inicio de sesión con email y contraseña
  async signInWithEmail(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Registro con email y contraseña
  async signUpWithEmail(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Inicio de sesión con proveedor OAuth
  async signInWithProvider(provider: 'google' | 'github' | 'apple'): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
      })

      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  },

  // Cerrar sesión
  async signOut(): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  },

  // Obtener sesión actual
  async getSession(): Promise<{ session: Session | null; error: Error | null }> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      return { session, error }
    } catch (error) {
      return { session: null, error: error as Error }
    }
  },

  // Escuchar cambios de autenticación
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session)
    })

    return () => subscription.unsubscribe()
  },
}