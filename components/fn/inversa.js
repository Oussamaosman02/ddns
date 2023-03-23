const inversa = (mascara, ip, rv) => {
  let num
  if (!rv) {
    if (mascara === '24') {
      num = 3
    } else if (mascara === '16') {
      num = 2
    } else {
      num = 1
    }
    const inv = ip.split('.').slice(num).reverse().join('.')
    return inv
  } else {
    if (mascara === '8') {
      num = 3
    } else if (mascara === '16') {
      num = 2
    } else {
      num = 1
    }
    const inv = ip.split('.').reverse().slice(num).join('.')
    return inv
  }
}

export default inversa
