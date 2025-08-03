import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'
import HomePage from './page'

test('renders CatGame', () => {
  render(<HomePage />)
  expect(screen.getByTestId('cat-game')).toBeTruthy()
})
