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

    const nombreDeDominio = ndominio.current.value
    const ipNormal = nservpri.current.value
    const ipSecundario = nservsec.current.value
    const ipMaestre = nservotro.current.value
    const mascara = nmascara.current.value
    const maestreNombre = nmaestre.current.value
    const ipFtp = nftp.current.value

    if (nombreDeDominio && ipNormal && ipSecundario && ipMaestre && mascara) {
      const IPZonaInversa = inversa(mascara, ipNormal, true)
      const ipInversa = inversa(mascara, ipNormal)
      const secundarioInversa = inversa(mascara, ipSecundario)
      const maestreInversa = inversa(mascara, ipMaestre)
      const ftpInversa = inversa(mascara, ipFtp)

      const result = {
        nombreDeDominio,
        ipNormal,
        ipSecundario,
        ipMaestre,
        mascara,
        ipInversa,
        IPZonaInversa,
        secundarioInversa,
        maestreInversa,
        maestreNombre,
        ftpInversa,
        ipFtp
      }
      data(result)
    } else {
      // eslint-disable-next-line no-undef
      alert('introduce todos los parámetros')
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-label='form'>
      <h2>Introduce los datos</h2>
      <input placeholder='Nombre de dominio' ref={ndominio} />
      <input placeholder='IP servidor primario' ref={nservpri} />
      <input placeholder='IP servidor secundario' ref={nservsec} />
      <input placeholder='Nombre otro host' ref={nmaestre} />
      <input placeholder='IP otro host' ref={nservotro} />
      <input placeholder='IP ftp' ref={nftp} />
      <input placeholder='Máscara 8-16-24' ref={nmascara} />
      <button>Generar tutorial</button>
    </form>
  )
}

export default Formulario
