import React, { useRef } from 'react'
import inversa from './fn/inversa'

function Formulario ({ data }) {
  const ndominio = useRef()
  const nservpri = useRef()
  const nservsec = useRef()
  const nservotro = useRef()
  const nmascara = useRef()
  const nmaestre = useRef()
  const nftp = useRef()

  function handleSubmit (e) {
    e.preventDefault()

    const dominio = ndominio.current.value
    const servpri = nservpri.current.value
    const servsec = nservsec.current.value
    const servotro = nservotro.current.value
    const mascara = nmascara.current.value
    const maestre = nmaestre.current.value
    const ftp = nftp.current.value

    if (dominio && servpri && servsec && servotro && mascara) {
      const inv = inversa(mascara, servpri, true)
      const invers = inversa(mascara, servpri)
      const inverssec = inversa(mascara, servsec)
      const inversotro = inversa(mascara, servotro)
      const inversftp = inversa(mascara, ftp)

      const result = { dominio, servpri, servsec, servotro, mascara, inv, invers, inverssec, inversotro, maestre, inversftp, ftp }
      data(result)
    } else {
      // eslint-disable-next-line no-undef
      alert('introduce todos los parámetros')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Introduce los datos</h2>
      <input placeholder='nombre de dominio' ref={ndominio} />
      <input placeholder='ip servidor primario' ref={nservpri} />
      <input placeholder='ip servidor secundario' ref={nservsec} />
      <input placeholder='nombre otro host' ref={nmaestre} />
      <input placeholder='ip otro host' ref={nservotro} />
      <input placeholder='ip ftp' ref={nftp} />
      <input placeholder='mascara 8-16-24' ref={nmascara} />
      <button>Generar documentación</button>
    </form>
  )
}

export default Formulario
