import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Dashboard } from '../pages/Dashboard'
import React from 'react'

// Mock axios so tests don't make real network requests
import axios from 'axios'
vi.mock('axios')

describe('Dashboard Component', () => {
    it('renders progress summary header', async () => {
        // Mock API responses for different endpoints
        (axios.get as any).mockImplementation((url: string) => {
            if (url.includes('/api/mudik/ranking')) return Promise.resolve({ data: [] });
            if (url.includes('/api/mudik/stats/vehicles')) return Promise.resolve({ data: [] });
            if (url.includes('/api/mudik/stats/timeline')) return Promise.resolve({ data: [] });
            if (url.includes('/api/mudik/public')) return Promise.resolve({ data: { data: [], total: 0 } });
            return Promise.resolve({ data: [] });
        });

        render(<Dashboard />)

        expect(await screen.findByText(/Pusat Analisis Mudik 2026/i)).toBeInTheDocument()
    })
})
