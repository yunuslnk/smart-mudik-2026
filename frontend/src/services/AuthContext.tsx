import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

// Configure axios to always hit the backend port 20262
const { protocol, hostname } = window.location;
// Only set baseURL if we are on a hostname (to avoid breaking local dev if needed, though port 20262 is standard here)
axios.defaults.baseURL = `${protocol}//${hostname}:20262`;
axios.defaults.withCredentials = true; // Ensure cookies are sent

interface User {
    id: string
    name: string
    email: string
    role: string
}

interface AuthContextType {
    user: User | null
    loading: boolean
    login: () => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkUser()
    }, [])

    const checkUser = async () => {
        try {
            const res = await axios.get('/api/auth/me')
            setUser(res.data)
        } catch (err) {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const login = () => {
        // Dynamically get current hostname and use backend port 20262
        const { protocol, hostname } = window.location;
        window.location.href = `${protocol}//${hostname}:20262/auth/google`;
    }

    const logout = async () => {
        // In a real app, clear cookie on backend
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}
