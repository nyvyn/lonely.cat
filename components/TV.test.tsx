import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TV from './TV'

describe('TV', () => {
  it('renders static animation and cat', () => {
    render(<TV />)
    expect(screen.getByTestId('tv')).toBeTruthy()
    expect(screen.getByTestId('cat')).toBeTruthy()
  })
})
