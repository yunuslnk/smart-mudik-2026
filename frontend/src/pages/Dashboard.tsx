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
    Grid
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
    const [myEntry, setMyEntry] = useState<any>(null)
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

                const activeEntry = meData.find((e: any) => e.status === 'BERANGKAT') ||
                    meData.find((e: any) => e.status === 'SAMPAI') ||
                    meData[0] || null
                setMyEntry(activeEntry)
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
            if (hour >= 5 && hour < 11) setGreeting('Selamat Pagi')
            else if (hour >= 11 && hour < 15) setGreeting('Selamat Siang')
            else if (hour >= 15 && hour < 18) setGreeting('Selamat Sore')
            else setGreeting('Selamat Malam')
        }
        updateGreeting()
    }, [user])

    const charts = [
        { title: 'Total Mudik', data: mudikFlow },
        { title: 'Arus Balik', data: returnFlow },
        { title: 'Top Kota', data: topDestinations }
    ]

    const BAR_COLORS = ['#4fd1c5', '#3b82f6', '#fbbf24', '#f87171']

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
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={charts[activeChart].data}>
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
                                    tickFormatter={(val) => `${val}%`} // Simplified per design
                                />
                                <Tooltip cursor={{ fill: '#eff6ff' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={35}>
                                    {charts[activeChart].data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="carousel-indicators flex justify-center">
                        {charts.map((_, i) => (
                            <button key={i} className={`dot ${activeChart === i ? 'active' : ''}`} onClick={() => setActiveChart(i)} />
                        ))}
                    </div>
                </section>

                {/* Travel Status Tooltip-style Card */}
                {user && myEntry && myEntry.kotaTujuan && myEntry.kotaAsal ? (
                    <div className="status-card">
                        <div className="icon-box">
                            <Home size={20} />
                        </div>
                        <div className="status-info">
                            <h4>Tujuan Kamu <span>ke {myEntry.kotaTujuan.name?.split(' ')[0]}</span> dari {myEntry.kotaAsal.name?.split(' ')[0]}</h4>
                        </div>
                    </div>
                ) : (
                    <div className="status-card">
                        <div className="icon-box"><PlusCircle size={20} /></div>
                        <div className="status-info"><h4>Daftarkan <span>Perjalanan Mudik</span> Anda Sekarang</h4></div>
                    </div>
                )}

                {/* Menu Grid Card */}
                <div className="menu-grid-card">
                    <div className="menu-grid">
                        <button className="menu-item" onClick={() => navigate('/donasi')}>
                            <div className="icon-circle bg-teal"><Heart size={24} /></div>
                            <span>Donasi</span>
                        </button>
                        <button className="menu-item" onClick={() => navigate('/daftar')}>
                            <div className="icon-circle bg-violet"><PlusCircle size={24} /></div>
                            <span>Tambah Data</span>
                        </button>
                        <button className="menu-item">
                            <div className="icon-circle bg-cyan"><ShoppingBag size={24} /></div>
                            <span>Pembelian</span>
                        </button>
                        <button className="menu-item">
                            <div className="icon-circle bg-pink"><Home size={24} /></div>
                            <span>KPR</span>
                        </button>

                        <button className="menu-item">
                            <div className="icon-circle bg-rose"><TrendingUp size={24} /></div>
                            <span>Reksa Dana</span>
                        </button>
                        <button className="menu-item">
                            <div className="icon-circle bg-teal"><CreditCard size={24} /></div>
                            <span>Cardless</span>
                        </button>
                        <button className="menu-item">
                            <div className="icon-circle bg-violet"><Smartphone size={24} /></div>
                            <span>Lifestyle</span>
                        </button>
                        <button className="menu-item">
                            <div className="icon-circle bg-blue-dark"><Grid size={24} /></div>
                            <span>Semua Menu</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}
