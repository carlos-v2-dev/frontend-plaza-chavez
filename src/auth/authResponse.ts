export interface AuthResponse {
        data: {
        user: User | null
        session: Session | null
        } | null
        error: Error | null
    }
    
export interface User {
        id: string
        email?: string
        user_metadata?: {
        [key: string]: any
        }
    }
    
export interface Session {
        access_token: string
        token_type: string
        user: User
        expires_at?: number
    }