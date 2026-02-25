import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Dashboard } from '../pages/Dashboard'
import React from 'react'

// Mock axios so tests don't make real network requests
import axios from 'axios'
vi.mock('axios')

describe('Dashboard Component', () => {
    it('renders progress summary header', () => {
        // Mock successful API response
        (axios.get as any).mockResolvedValue({
            data: { data: [], total: 0, totalPages: 1 }
        })

        render(<Dashboard />)

        expect(screen.getByText(/Pusat Analisis Mudik 2026/i)).toBeInTheDocument()
    })
})
