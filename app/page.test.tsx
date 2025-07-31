import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'
import HomePage from './page'

test('renders HomePage with cat and static', async () => {
  render(<HomePage />)
  const cat = await screen.findByTestId('cat')
  const staticElement = await screen.findByTestId('static')
  expect(cat).toBeTruthy()
  expect(staticElement).toBeTruthy()
})
