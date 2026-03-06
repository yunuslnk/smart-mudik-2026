import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
    BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip,
    Cell, CartesianGrid
} from 'recharts'
import {
    Heart,
    PlusCircle,
    Home,
    ShoppingBag,
    TrendingUp,
    CreditCard,
    Smartphone,
    Grid,
    BarChart2
} from 'lucide-react'
import { useAuth } from '../services/AuthContext'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

export const Dashboard: React.FC = () => {
    const { user, login } = useAuth()
    const navigate = useNavigate()

    const [activeChart, setActiveChart] = useState(0)
    const [mudikFlow, setMudikFlow] = useState<any[]>([])
    const [returnFlow, setReturnFlow] = useState<any[]>([])
    const [topDestinations, setTopDestinations] = useState<any[]>([])
    const [departureEntry, setDepartureEntry] = useState<any>(null)
    const [returnEntry, setReturnEntry] = useState<any>(null)
    const [greeting, setGreeting] = useState('')
    const [totalTravelers, setTotalTravelers] = useState(0)

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [flow, retFlow, topDest, me, totalCount] = await Promise.all([
                    axios.get('/api/mudik/stats/flow'),
                    axios.get('/api/mudik/stats/return-flow'),
                    axios.get('/api/mudik/stats/top-destinations'),
                    user ? axios.get('/api/mudik/me') : Promise.resolve({ data: [] }),
                    axios.get('/api/mudik/stats/total')
                ])

                const sanitizeName = (name: string) => (name || '').replace(/(Kabupaten|Kab\.|KAB\.|KAB)\s*/gi, '').trim()

                const flowData = Array.isArray(flow.data) ? flow.data : []
                const retFlowData = Array.isArray(retFlow.data) ? retFlow.data : []
                const topDestData = Array.isArray(topDest.data) ? topDest.data : []
                const meData = Array.isArray(me.data) ? me.data : []

                setMudikFlow(flowData.map((d: any) => ({
                    date: new Date(d.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
                    count: d._count?.id || 0
                })))
                setReturnFlow(retFlowData.map((d: any) => ({
                    date: new Date(d.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
                    count: d._count?.id || 0
                })))
                setTopDestinations(topDestData.map((d: any) => ({
                    name: sanitizeName(d.name),
                    count: d.count
                })))

                const dep = meData.find((e: any) => e.status === 'BERANGKAT' || e.status === 'SAMPAI')
                const ret = meData.find((e: any) => e.status === 'BALIK')

                setDepartureEntry(dep || null)
                setReturnEntry(ret || null)
                setTotalTravelers(totalCount.data?.total || totalCount.data || 0)
            } catch (err) {
                console.error('Failed to fetch dashboard data', err)
            }
        }
        fetchAll()
    }, [user])

    useEffect(() => {
        const updateGreeting = () => {
            const hour = new Date().getHours()
            const layout = document.querySelector('.layout-container')

            // Remove old classes
            layout?.classList.remove('morning', 'day', 'afternoon', 'night')

            if (hour >= 5 && hour < 11) {
                setGreeting('Selamat Pagi')
                layout?.classList.add('morning')
            } else if (hour >= 11 && hour < 15) {
                setGreeting('Selamat Siang')
                layout?.classList.add('day')
            } else if (hour >= 15 && hour < 18) {
                setGreeting('Selamat Sore')
                layout?.classList.add('afternoon')
            } else {
                setGreeting('Selamat Malam')
                layout?.classList.add('night')
            }
        }
        updateGreeting()
    }, [user])

    const charts = [
        { title: 'Arus Mudik (Statistik)', data: mudikFlow },
        { title: 'Arus Balik (Statistik)', data: returnFlow },
        { title: 'Top Tujuan Kota', data: topDestinations }
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveChart(prev => (prev + 1) % charts.length)
        }, 60000) // 1 minute interval

        return () => clearInterval(interval)
    }, [charts.length, activeChart]) // Re-run effect when activeChart changes to reset interval

    return (
        <div className="dashboard-container">
            <div className="dashboard-inner animate-fade-in">

                {/* Greeting */}
                <div className="greeting-section">
                    <h2>{greeting}{user && user.email ? `, ${user.email.split('@')[0]}` : ''}</h2>
                </div>

                {/* Chart Card */}
                <section className="chart-card">
                    <div className="chart-header">
                        <h3>{charts[activeChart].title}</h3>
                    </div>

                    <div className="chart-content">
                        {charts[activeChart].data.length > 0 ? (
                            <ResponsiveContainer width="100%" height={180}>
                                <BarChart data={charts[activeChart].data}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.6} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                                    <XAxis
                                        dataKey={activeChart === 2 ? 'name' : 'date'}
                                        axisLine={false}
                                        tickLine={false}
                                        fontSize={10}
                                        stroke="#94a3b8"
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        fontSize={10}
                                        stroke="#94a3b8"
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar
                                        dataKey="count"
                                        fill="url(#colorCount)"
                                        radius={[6, 6, 0, 0]}
                                        barSize={activeChart === 2 ? 25 : 35}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="empty-chart-placeholder">
                                <BarChart2 size={48} strokeOpacity={0.1} />
                                <p>Belum ada data perjalanan saat ini</p>
                            </div>
                        )}
                    </div>

                    <div className="carousel-indicators flex justify-center">
                        {charts.map((_, i) => (
                            <button key={i} className={`dot ${activeChart === i ? 'active' : ''}`} onClick={() => setActiveChart(i)} />
                        ))}
                    </div>
                </section>

                {/* Journey Table Card */}
                {user && (departureEntry || returnEntry) ? (
                    <div className="journey-card animate-fade-in">
                        <div className="journey-header">
                            <Home size={18} className="text-accent" />
                            <h3>Status Perjalanan Kamu</h3>
                        </div>
                        <table className="journey-table">
                            <thead>
                                <tr>
                                    <th>TIPE</th>
                                    <th>RUTE</th>
                                    <th>STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {departureEntry && (
                                    <tr>
                                        <td><span className="badge-mudik">Mudik</span></td>
                                        <td>
                                            <div className="route-text">
                                                <strong>{departureEntry.kotaTujuan.name?.split(' ')[0]}</strong>
                                                <small>dari {departureEntry.kotaAsal.name?.split(' ')[0]}</small>
                                            </div>
                                        </td>
                                        <td><span className={`status-pill ${departureEntry.status.toLowerCase()}`}>{departureEntry.status}</span></td>
                                    </tr>
                                )}
                                {returnEntry && (
                                    <tr>
                                        <td><span className="badge-balik">Balik</span></td>
                                        <td>
                                            <div className="route-text">
                                                <strong>{returnEntry.kotaTujuan.name?.split(' ')[0]}</strong>
                                                <small>dari {returnEntry.kotaAsal.name?.split(' ')[0]}</small>
                                            </div>
                                        </td>
                                        <td><span className="status-pill balik">{returnEntry.status}</span></td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="status-card clickable animate-fade-in" onClick={() => navigate('/daftar')}>
                        <div className="icon-box"><PlusCircle size={20} /></div>
                        <div className="status-info"><h4>Daftarkan <span>Perjalanan Mudik</span> Anda Sekarang</h4></div>
                    </div>
                )}


            </div>
        </div>
    )
}
