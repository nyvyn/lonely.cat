import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'
import Page from './page'

test('renders TV page', async () => {
  render(<Page />)
  const tv = await screen.findByTestId('tv')
  expect(tv).toBeTruthy()
})
