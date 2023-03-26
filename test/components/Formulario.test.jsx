import { screen, render, fireEvent } from '@testing-library/react'
import Formulario from '../../components/Formulario'
import { test, describe, expect, jest } from '@jest/globals'

describe('Test de <Formulario/>', () => {
  const handle = jest.fn()
  const data = {
    nombreDeDominio: 'dominio.asir2',
    ipNormal: '10.8.23.5',
    ipInversa: '5.23',
    IPZonaInversa: '8.10',
    ipSecundario: '10.8.23.7',
    secundarioInversa: '7.23',
    ipMaestre: '10.8.23.9',
    maestreInversa: '9.23',
    maestreNombre: 'nombre',
    ipFtp: '10.8.23.15',
    ftpInversa: '15.23',
    mascara: '16'
  }
  const { nombreDeDominio, ipNormal, ipSecundario, maestreNombre, ipMaestre, ipFtp, mascara } = data

  test('debe coincidir con el snapshot', () => {
    const { container } = render(<Formulario data={handle} />)
    expect(container).toMatchSnapshot()
  })
  test('debe activar el handleSubmit', () => {
    render(<Formulario data={handle} />)
    const form = screen.getByRole('form')
    function disparar (placeholder, value) {
      const input = screen.getByPlaceholderText(placeholder)
      fireEvent.input(input, { target: { value } })
    }
    disparar('nombre de dominio', nombreDeDominio)
    disparar('ip servidor primario', ipNormal)
    disparar('ip servidor secundario', ipSecundario)
    disparar('nombre otro host', maestreNombre)
    disparar('ip otro host', ipMaestre)
    disparar('ip ftp', ipFtp)
    disparar('mascara 8-16-24', mascara)

    fireEvent.submit(form)
    expect(handle).toHaveBeenCalled()
  })
  test('debe devolver los valores correctos', () => {
    render(<Formulario data={handle} />)
    const form = screen.getByRole('form')
    function disparar (placeholder, value) {
      const input = screen.getByPlaceholderText(placeholder)
      fireEvent.input(input, { target: { value } })
    }
    disparar('nombre de dominio', nombreDeDominio)
    disparar('ip servidor primario', ipNormal)
    disparar('ip servidor secundario', ipSecundario)
    disparar('nombre otro host', maestreNombre)
    disparar('ip otro host', ipMaestre)
    disparar('ip ftp', ipFtp)
    disparar('mascara 8-16-24', mascara)

    fireEvent.submit(form)
    expect(handle.mock.lastCall[0]).toEqual(data)
  })
})
