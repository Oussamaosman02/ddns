import React, { useRef } from 'react'
import './formulario.css'

export default function Formulario () {
  const ndominio = useRef()
  const nservpri = useRef()
  const nservsec = useRef()
  const nservotro = useRef()
  const nmascara = useRef()

  function inversa (mascara, ip, rv) {
    let num

    if (mascara === '24') {
      num = 1
    } else if (mascara === '16') {
      num = 2
    } else {
      num = 3
    }
    if (!rv) {
      const inv = ip.split('.').slice(num).reverse().join('.')
      return inv
    } else {
      const inv = ip.split('.').reverse().slice(num).join('.')
      return inv
    }
  }
  function handleSubmit () {
    const dominio = ndominio.current.value
    const servpri = nservpri.current.value
    const servsec = nservsec.current.value
    const servotro = nservotro.current.value
    const mascara = nmascara.current.value

    if (dominio && servpri && servsec && servotro && mascara) {
      const inv = inversa(mascara, servpri, true)
      const invers = inversa(mascara, servpri)
      const inverssec = inversa(mascara, servsec)
      const inversotro = inversa(mascara, servotro)
      console.log(
        {
          nombreDeDominio: dominio,
          ipNormal: servpri,
          ipSecundario: servsec,
          ipMaestre: servotro,
          mascara,
          IPZonaInversa: inv,
          ipInversa: invers,
          secundarioInversa: inverssec,
          maestreInversa: inversotro
        }
      )
    } else {
      // eslint-disable-next-line no-undef
      alert('introduce todos los parámetros')
    }
  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      handleSubmit()
    }}
    >
      <h2>Introduce los datos</h2>
      <input placeholder='nombre de dominio' ref={ndominio} />
      <input placeholder='ip servidor primario' ref={nservpri} />
      <input placeholder='ip servidor secundario' ref={nservsec} />
      <input placeholder='ip otro' ref={nservotro} />
      <input placeholder='mascara 8/16/24' ref={nmascara} />
      <button>Generar documentación</button>
    </form>
  )
}
