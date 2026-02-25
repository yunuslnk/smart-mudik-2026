import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
    BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip,
    AreaChart, Area, PieChart, Pie, Cell, CartesianGrid
} from 'recharts'
import { ArrowUpRight, Search, ChevronLeft, ChevronRight, TrendingUp, Car, MapPin } from 'lucide-react'
import './Dashboard.css'

const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];

export const Dashboard: React.FC = () => {
    const [mudikData, setMudikData] = useState<any[]>([])
    const [search, setSearch] = useState('')
    const [stats, setStats] = useState({ total: 0 })
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const [rankData, setRankData] = useState<any[]>([])
    const [vehicleData, setVehicleData] = useState<any[]>([])
    const [timelineData, setTimelineData] = useState<any[]>([])

    // Fetch analytical data once
    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const [rankRes, vRes, tRes] = await Promise.all([
                    axios.get('/api/mudik/ranking'),
                    axios.get('/api/mudik/stats/vehicles'),
                    axios.get('/api/mudik/stats/timeline')
                ])

                // Format ranking: take regency name and count
                setRankData(rankRes.data.map((item: any) => ({
                    name: item.name,
                    count: item._count.mudiksTujuan
                })))

                // Format vehicle distribution
                setVehicleData(vRes.data.map((item: any) => ({
                    name: item.kendaraan,
                    value: item._count.kendaraan
                })))

                // Format timeline: ensure dates are readable
                setTimelineData(tRes.data.map((item: any) => ({
                    date: new Date(item.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
                    count: item._count.id
                })))

            } catch (err) {
                console.error('Failed to fetch analytics', err)
            }
        }
        fetchAnalytics()
    }, [])

    // Fetch paginated table data
    useEffect(() => {
        fetchPaginatedData()
    }, [page, search])

    const fetchPaginatedData = async () => {
        try {
            const res = await axios.get('/api/mudik/public', {
                params: { search, page, limit: 30 }
            })
            setMudikData(res.data.data)
            setStats({ total: res.data.total })
            setTotalPages(res.data.totalPages)
        } catch (err) {
            console.error('Failed to fetch paginated data', err)
        }
    }

    return (
        <div className="dashboard-grid">
            <div className="main-col">
                <header className="page-header">
                    <div>
                        <span className="breadcrumb">Dashboard</span>
                        <h1>Pusat Analisis Mudik 2026</h1>
                    </div>
                </header>

                <div className="top-stats-row">
                    <section className="stats-card card">
                        <div className="stats-header">
                            <span className="stats-label">Total Pemudik Terdaftar</span>
                            <div className="trend positive">
                                <ArrowUpRight size={16} />
                                <span>Real-time</span>
                            </div>
                        </div>
                        <h2 className="stats-value">{stats.total.toLocaleString('id-ID')}</h2>
                        <p className="text-muted">Total data perjalanan yang masuk dalam sistem.</p>
                    </section>
                </div>

                <div className="grid-2 mt-2">
                    <section className="card">
                        <h3>Tren Pendaftaran (Timeline)</h3>
                        <div className="chart-container h-250">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={timelineData}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} />
                                    <YAxis hide />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="count" stroke="#2563eb" fillOpacity={1} fill="url(#colorCount)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </section>

                    <section className="card">
                        <h3>10 Kota Tujuan Terfavorit</h3>
                        <div className="chart-container h-250">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={rankData} layout="vertical">
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={80} fontSize={10} axisLine={false} tickLine={false} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#2563eb" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </section>
                </div>

                <div className="grid-2 mt-2">
                    <section className="card">
                        <h3>Distribusi Kendaraan</h3>
                        <div className="chart-container h-250 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={vehicleData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {vehicleData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="legend-grid mt-1">
                            {vehicleData.map((item, i) => (
                                <div key={item.name} className="legend-item-small">
                                    <span className="dot" style={{ background: COLORS[i % COLORS.length] }}></span>
                                    <span>{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="card search-section">
                        <h3>Pencarian & Filter</h3>
                        <div className="search-box-dashboard">
                            <Search size={20} className="text-muted" />
                            <input
                                type="text"
                                placeholder="Cari Kota atau Provinsi..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                            />
                        </div>
                        <p className="mt-1 text-sm text-muted">Mencari di {stats.total} record data per {new Date().toLocaleDateString()}.</p>
                    </section>
                </div>

                <section className="card mt-2">
                    <div className="flex-row">
                        <h3>Data Perjalanan Terbaru (30 record/hal)</h3>
                        <div className="pagination-ctrls">
                            <button
                                className="btn-icon"
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className="page-indicator">Hal. {page} dari {totalPages}</span>
                            <button
                                className="btn-icon"
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="mudik-table-wrapper">
                        <table className="mudik-table">
                            <thead>
                                <tr>
                                    <th>Asal</th>
                                    <th>Tujuan</th>
                                    <th>Kendaraan</th>
                                    <th>Waktu</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mudikData.map((item: any) => (
                                    <tr key={item.id}>
                                        <td>{item.kotaAsal.name}, {item.provinsiAsal.name}</td>
                                        <td>{item.kotaTujuan.name}, {item.provinsiTujuan.name}</td>
                                        <td><div className="tag-vehicle">{item.kendaraan}</div></td>
                                        <td>{new Date(item.tanggal).toLocaleDateString('id-ID')} {item.jam}</td>
                                        <td><span className={`status-badge ${item.status}`}>{item.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    )
}
