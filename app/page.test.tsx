import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'
import HomePage from './page'

test('renders HomePage with TV', async () => {
  render(<HomePage />)
  const tv = await screen.findByTestId('tv')
  expect(tv).toBeTruthy()
})
