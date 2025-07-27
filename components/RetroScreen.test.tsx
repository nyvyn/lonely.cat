import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import RetroScreen from './RetroScreen'

describe('RetroScreen', () => {
  it('renders TV frame', () => {
    render(<RetroScreen />)
    expect(screen.getByTestId('tv')).toBeTruthy()
  })
})
