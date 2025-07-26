import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Cat from './Cat'

describe('Cat', () => {
  it('renders cat element', () => {
    render(<Cat />)
    expect(screen.getByTestId('cat')).toBeTruthy()
    expect(screen.getByTestId('tail')).toBeTruthy()
  })
})
