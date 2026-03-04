import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
    Home,
    BarChart2,
    User,
    LogOut,
    PlusCircle,
    Maximize
} from 'lucide-react'
import { useAuth } from '../services/AuthContext'
import { ChatWidget } from './ChatWidget'
import './Layout.css'

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation()
    const { user, login, logout } = useAuth()

    return (
        <div className="layout-container premium-view">
            {/* Desktop Header */}
            <header className="premium-header">
                <Link to="/" className="premium-logo">smart mudik 2026</Link>
                <nav className="premium-nav">
                    <Link to="/" className={`premium-nav-item ${location.pathname === '/' ? 'active' : ''}`}>Dashboard</Link>
                    <Link to="/daftar" className={`premium-nav-item ${location.pathname === '/daftar' ? 'active' : ''}`}>Daftar</Link>
                    <Link to="/donasi" className={`premium-nav-item ${location.pathname === '/donasi' ? 'active' : ''}`}>Donasi</Link>
                </nav>
            </header>

            <main className="content">
                {children}
            </main>

            <ChatWidget />

            {/* Bottom Navigation (Mobile View) */}
            <nav className="bottom-nav">
                <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
                    <Home />
                    <span>Home</span>
                </Link>
                <Link to="/stats" className={`nav-item ${location.pathname === '/stats' ? 'active' : ''}`}>
                    <BarChart2 />
                    <span>Stats</span>
                </Link>

                <div className="qris-btn-container">
                    <button className="qris-btn" onClick={() => (window.location.href = '/daftar')}>
                        <Maximize size={28} />
                        <span>DAFTAR</span>
                    </button>
                </div>

                <Link to="/profile" className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
                    <User />
                    <span>Akun</span>
                </Link>

                {user ? (
                    <button onClick={logout} className="nav-item btn-plain" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                        <LogOut />
                        <span>Keluar</span>
                    </button>
                ) : (
                    <button onClick={login} className="nav-item btn-plain" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                        <User />
                        <span>Masuk</span>
                    </button>
                )}
            </nav>
        </div>
    )
}
