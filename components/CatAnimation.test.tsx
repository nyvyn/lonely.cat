import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import CatAnimation from './CatAnimation'

describe('CatAnimation', () => {
  it('renders cat element', () => {
    render(<CatAnimation />)
    expect(screen.getByTestId('cat')).toBeTruthy()
    expect(screen.getByTestId('cat-sprite')).toBeTruthy()
  })
})
