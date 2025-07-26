import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import StaticAnimation from './StaticAnimation'

describe('StaticAnimation', () => {
  it('renders static container', () => {
    render(<StaticAnimation />)
    expect(screen.getByTestId('static')).toBeTruthy()
  })
})
