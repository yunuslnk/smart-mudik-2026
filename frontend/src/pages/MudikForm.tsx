import { useState, useEffect } from 'react'
import axios from 'axios'
import { MapPin, Calendar, Clock, Car, Send } from 'lucide-react'
import './MudikForm.css'

interface Region {
    id: string
    name: string
}

export const MudikForm: React.FC = () => {
    const [provinces, setProvinces] = useState<Region[]>([])
    const [regenciesAsal, setRegenciesAsal] = useState<Region[]>([])
    const [regenciesTujuan, setRegenciesTujuan] = useState<Region[]>([])

    const [formData, setFormData] = useState({
        tanggal: '',
        jam: '',
        provinsiAsalId: '',
        kotaAsalId: '',
        provinsiTujuanId: '',
        kotaTujuanId: '',
        kendaraan: 'Mobil',
    })

    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        fetchProvinces()
    }, [])

    const fetchProvinces = async () => {
        try {
            const res = await axios.get('/api/regions/provinces')
            setProvinces(res.data)
        } catch (err) {
            console.error('Failed to fetch provinces', err)
        }
    }

    const handleProvinceAsalChange = async (provId: string) => {
        setFormData({ ...formData, provinsiAsalId: provId, kotaAsalId: '' })
        if (!provId) {
            setRegenciesAsal([])
            return
        }
        try {
            const res = await axios.get(`/api/regions/regencies/${provId}`)
            setRegenciesAsal(res.data)
        } catch (err) {
            console.error('Failed to fetch regencies asal', err)
        }
    }

    const handleProvinceTujuanChange = async (provId: string) => {
        setFormData({ ...formData, provinsiTujuanId: provId, kotaTujuanId: '' })
        if (!provId) {
            setRegenciesTujuan([])
            return
        }
        try {
            const res = await axios.get(`/api/regions/regencies/${provId}`)
            setRegenciesTujuan(res.data)
        } catch (err) {
            console.error('Failed to fetch regencies tujuan', err)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await axios.post('/api/mudik', {
                ...formData,
                tanggal: new Date(formData.tanggal).toISOString(),
            })
            setSuccess(true)
        } catch (err) {
            alert('Gagal mendaftarkan mudik. Pastikan Anda sudah login, semua wilayah diisi, dan belum mendaftar sebelumnya.')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="form-success card">
                <Send size={48} className="text-success" />
                <h2>Pendaftaran Berhasil!</h2>
                <p>Data mudik Anda telah tercatat dalam sistem kami.</p>
                <button onClick={() => window.location.href = '/'} className="btn-primary">Kembali ke Dashboard</button>
            </div>
        )
    }

    return (
        <div className="form-container">
            <div className="card">
                <header className="form-header">
                    <h1>Daftar Mudik 2026</h1>
                    <p>Isi formulir di bawah untuk mencatatkan perjalanan mudik Anda.</p>
                </header>

                <form onSubmit={handleSubmit} className="mudik-form">
                    <div className="form-grid">
                        {/* Wilayah Asal */}
                        <div className="input-group">
                            <label><MapPin size={16} /> Provinsi Asal</label>
                            <select
                                required
                                value={formData.provinsiAsalId}
                                onChange={e => handleProvinceAsalChange(e.target.value)}
                            >
                                <option value="">Pilih Provinsi...</option>
                                {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div className="input-group">
                            <label><MapPin size={16} /> Kota/Kab Asal</label>
                            <select
                                required
                                disabled={!formData.provinsiAsalId}
                                value={formData.kotaAsalId}
                                onChange={e => setFormData({ ...formData, kotaAsalId: e.target.value })}
                            >
                                <option value="">Pilih Kota...</option>
                                {regenciesAsal.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                        </div>

                        {/* Wilayah Tujuan */}
                        <div className="input-group">
                            <label><MapPin size={16} /> Provinsi Tujuan</label>
                            <select
                                required
                                value={formData.provinsiTujuanId}
                                onChange={e => handleProvinceTujuanChange(e.target.value)}
                            >
                                <option value="">Pilih Provinsi...</option>
                                {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div className="input-group">
                            <label><MapPin size={16} /> Kota/Kab Tujuan</label>
                            <select
                                required
                                disabled={!formData.provinsiTujuanId}
                                value={formData.kotaTujuanId}
                                onChange={e => setFormData({ ...formData, kotaTujuanId: e.target.value })}
                            >
                                <option value="">Pilih Kota...</option>
                                {regenciesTujuan.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                        </div>

                        <div className="input-group">
                            <label><Calendar size={16} /> Tanggal Keberangkatan</label>
                            <input
                                type="date"
                                required
                                value={formData.tanggal}
                                onChange={e => setFormData({ ...formData, tanggal: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label><Clock size={16} /> Jam Keberangkatan</label>
                            <input
                                type="time"
                                required
                                value={formData.jam}
                                onChange={e => setFormData({ ...formData, jam: e.target.value })}
                            />
                        </div>
                        <div className="input-group full">
                            <label><Car size={16} /> Jenis Kendaraan</label>
                            <select
                                value={formData.kendaraan}
                                onChange={e => setFormData({ ...formData, kendaraan: e.target.value })}
                            >
                                <option value="Mobil">Mobil Pribadi</option>
                                <option value="Motor">Sepeda Motor</option>
                                <option value="Bus">Bus</option>
                                <option value="Kereta">Kereta Api</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Mengirim...' : 'Daftarkan Perjalanan'}
                    </button>
                </form>
            </div>
        </div>
    )
}
