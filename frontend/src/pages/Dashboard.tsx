import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
    BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip,
    AreaChart, Area, CartesianGrid, Cell
} from 'recharts'
import { Plus, Heart, Sun, Moon, Home, ChevronRight, Edit3 } from 'lucide-react'
import { useAuth } from '../services/AuthContext'
import { useTheme } from '../services/ThemeContext'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

export const Dashboard: React.FC = () => {
    const { user, login } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const navigate = useNavigate()

    const [activeChart, setActiveChart] = useState(0)
    const [mudikFlow, setMudikFlow] = useState<any[]>([])
    const [returnFlow, setReturnFlow] = useState<any[]>([])
    const [topDestinations, setTopDestinations] = useState<any[]>([])
    const [myEntry, setMyEntry] = useState<any>(null)
    const [greeting, setGreeting] = useState('')

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [flow, retFlow, topDest, me] = await Promise.all([
                    axios.get('/api/mudik/stats/flow'),
                    axios.get('/api/mudik/stats/return-flow'),
                    axios.get('/api/mudik/stats/top-destinations'),
                    user ? axios.get('/api/mudik/me') : Promise.resolve({ data: null })
                ])

                // Match the backend response structure directly
                const flowData = flow.data || []
                const retFlowData = retFlow.data || []
                const destData = topDest.data || []

                setMudikFlow(flowData.map((d: any) => ({
                    date: new Date(d.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
                    count: d._count?.id || 0
                })))
                setReturnFlow(retFlowData.map((d: any) => ({
                    date: new Date(d.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
                    count: d._count?.id || 0
                })))
                setTopDestinations(destData.map((d: any) => ({
                    name: d.name,
                    count: d.count
                })))
                setMyEntry(me.data)
            } catch (err) {
                console.error('Failed to fetch dashboard data', err)
            }
        }
        fetchAll()
    }, [user])

    useEffect(() => {
        const updateGreeting = () => {
            const hour = new Date().getHours()
            if (!user) {
                setGreeting('Selamat Pagi')
                return
            }

            if (hour >= 5 && hour < 11) setGreeting('Selamat Pagi')
            else if (hour >= 11 && hour < 15) setGreeting('Selamat Siang')
            else if (hour >= 15 && hour < 18) setGreeting('Selamat Sore')
            else setGreeting('Selamat Malam')
        }
        updateGreeting()
        const interval = setInterval(updateGreeting, 60000)
        return () => clearInterval(interval)
    }, [user])

    const charts = [
        {
            title: 'Grafik Pemudik',
            data: mudikFlow,
            type: 'area',
            color: '#3b82f6'
        },
        {
            title: 'Grafik Arus Balik',
            data: returnFlow,
            type: 'area',
            color: '#8b5cf6'
        },
        {
            title: 'Tujuan Kota 7 Terbanyak',
            data: topDestinations,
            type: 'bar',
            color: '#3b82f6'
        }
    ]

    const handleAddData = () => {
        if (!user) {
            login()
        } else {
            navigate('/daftar')
        }
    }

    return (
        <div className="dashboard-container premium-gradient">
            <div className="dashboard-inner animate-fade-in">
                {/* Header Section */}
                <header className="dashboard-header text-center">
                    <h1 className="app-title">smart mudik 2026</h1>
                    <p className="greeting">
                        {greeting}{user ? `, ${user.email}` : ''}
                    </p>
                </header>

                {/* Chart Carousel Section */}
                <div className="chart-wrapper">
                    <section className="chart-card bg-card shadow-lg">
                        <div className="chart-header flex justify-between items-center">
                            <h3>{charts[activeChart].title}</h3>
                            <button className="btn-atur flex items-center gap-1">
                                <Edit3 size={14} /> Atur
                            </button>
                        </div>

                        <div className="chart-content">
                            <ResponsiveContainer width="100%" height={220}>
                                {charts[activeChart].type === 'area' ? (
                                    <AreaChart data={charts[activeChart].data}>
                                        <defs>
                                            <linearGradient id="gradientColor" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={charts[activeChart].color} stopOpacity={0.3} />
                                                <stop offset="95%" stopColor={charts[activeChart].color} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                        <XAxis dataKey={activeChart === 2 ? 'name' : 'date'} stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow)' }} />
                                        <Area
                                            type="monotone"
                                            dataKey={activeChart === 2 ? 'count' : 'count'}
                                            stroke={charts[activeChart].color}
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#gradientColor)"
                                        />
                                    </AreaChart>
                                ) : (
                                    <BarChart data={charts[activeChart].data}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                        <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow)' }} />
                                        <Bar dataKey="count" fill={charts[activeChart].color} radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                )}
                            </ResponsiveContainer>
                        </div>

                        {/* Carousel Indicators */}
                        <div className="carousel-indicators flex justify-center gap-2 mt-4">
                            {charts.map((_, i) => (
                                <button
                                    key={i}
                                    className={`dot ${activeChart === i ? 'active' : ''}`}
                                    onClick={() => setActiveChart(i)}
                                />
                            ))}
                        </div>
                    </section>
                </div>

                {/* Lower Content */}
                <div className="dashboard-content-main">
                    {/* Travel Status Card */}
                    {user && myEntry ? (
                        <div className="status-card glass-card flex items-center justify-between">
                            <div className="status-info flex items-center gap-4">
                                <div className="icon-box bg-accent">
                                    <Home size={24} color="#fff" />
                                </div>
                                <div>
                                    <h4>Tujuan kamu adalah {myEntry.kotaTujuan.name.toUpperCase()}</h4>
                                    <p>Kamu dari {myEntry.kotaAsal.name.toUpperCase()}</p>
                                    <p className="status-text">Status kamu {myEntry.status === 'BERANGKAT' ? 'masih dalam perjalanan' : 'sudah sampai'}</p>
                                </div>
                            </div>
                            <button className="btn-next">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="status-card glass-card flex items-center justify-center py-4">
                            <p className="text-muted">Daftarkan mudikmu sekarang!</p>
                        </div>
                    )}

                    {/* Action Grid */}
                    <div className="action-grid mt-6">
                        <button className="action-item" onClick={handleAddData}>
                            <div className="icon-circle bg-blue">
                                <Plus size={28} />
                            </div>
                            <span>Tambah data</span>
                        </button>

                        <button className="action-item" onClick={() => navigate('/donasi')}>
                            <div className="icon-circle bg-pink">
                                <Heart size={28} />
                            </div>
                            <span>Donasi</span>
                        </button>

                        <button className="action-item" onClick={toggleTheme}>
                            <div className="icon-circle bg-dark">
                                {theme === 'light' ? <Moon size={28} /> : <Sun size={28} />}
                            </div>
                            <span>Tema {theme === 'light' ? 'gelap' : 'terang'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
