import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import CatGame from './CatGame'

describe('CatGame', () => {
  it('renders game container', () => {
    render(<CatGame />)
    expect(screen.getByTestId('cat-game')).toBeTruthy()
  })
})
