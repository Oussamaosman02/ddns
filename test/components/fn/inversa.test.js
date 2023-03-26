import inversa from '../../../components/fn/inversa'
import { test, describe, expect } from '@jest/globals'

describe('pruebas para inversa()', () => {
  const mascara = '24'
  const ip = '10.8.23.15'
  test('debe devolver la ip inversa', () => {
    expect(inversa(mascara, ip)).toBe('15')
  })
  test('debe devolver la ip de la zona inversa', () => {
    expect(inversa(mascara, ip, true)).toBe('23.8.10')
  })
})
