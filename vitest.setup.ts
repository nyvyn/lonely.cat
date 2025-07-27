import { vi } from 'vitest'

if (window.HTMLCanvasElement) {
  // Use a standard function to preserve the `this` context, which is the canvas element
  // @ts-ignore
    window.HTMLCanvasElement.prototype.getContext = vi.fn(function getContext(this: any) {
    return {
      createImageData: (width: number, height: number) => ({
        data: new Uint8ClampedArray(width * height * 4),
      }),
      putImageData: vi.fn(),
      // `this` refers to the canvas element instance, so the context's canvas
      // property will have the correct width and height set by the component.
      canvas: this,
    }
  })
}