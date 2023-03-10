import React, { useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

function App () {
  const [nombreDeDominio, setNombreDeDominio] = useState('dominio.asir2')
  const [ipNormal, setIpNormal] = useState('10.8.23.5')
  const [ipInversa, setIpInversa] = useState('5.23')
  const [IPZonaInversa, setIPZonaInversa] = useState('8.10')
  const [ipSecundario, setIpSecundario] = useState('10.8.23.7')
  const [secundarioInversa, setSecundarioInversa] = useState('7.23')
  const [ipMaestre, setIpMaestre] = useState('10.8.23.9')
  const [maestreInversa, setMaestreInversa] = useState('9.23')
  const [maestreNombre, setMaestreNombre] = useState('ftp')
  const [ipFtp, setIpFtp] = useState('10.8.23.15')
  const [ftpInversa, setFtpInversa] = useState('15.23')
  const [mascara, setMascara] = useState('16')

  // formulario
  const ndominio = useRef()
  const nservpri = useRef()
  const nservsec = useRef()
  const nservotro = useRef()
  const nmascara = useRef()
  const nmaestre = useRef()
  const nftp = useRef()

  function inversa (mascara, ip, rv) {
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
  function handleSubmit () {
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

      setNombreDeDominio(dominio)
      setIpNormal(servpri)
      setIpSecundario(servsec)
      setIpMaestre(servotro)
      setMascara(mascara)
      setIPZonaInversa(inv)
      setIpInversa(invers)
      setSecundarioInversa(inverssec)
      setMaestreInversa(inversotro)
      setMaestreNombre(maestre)
      setFtpInversa(inversftp)
      setIpFtp(ftp)
    } else {
      // eslint-disable-next-line no-undef
      alert('introduce todos los par??metros')
    }
  }
  return (
    <div className='App'>
      <div>
        <a href='https://vitejs.dev' target='_blank' rel='noreferrer'>
          <img src='/vite.svg' className='logo' alt='Vite logo' />
        </a>
        <a href='https://reactjs.org' target='_blank' rel='noreferrer'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
      </div>
      <div className='texto'>
        <h1>Vite + React</h1>
        <div>
          <form onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
          >
            <h2>Introduce los datos</h2>
            <input placeholder='nombre de dominio' ref={ndominio} />
            <input placeholder='ip servidor primario' ref={nservpri} />
            <input placeholder='ip servidor secundario' ref={nservsec} />
            <input placeholder='nombre otro host' ref={nmaestre} />
            <input placeholder='ip otro host' ref={nservotro} />
            <input placeholder='ip ftp' ref={nftp} />
            <input placeholder='mascara 8-16-24' ref={nmascara} />
            <button>Generar documentaci??n</button>
          </form>
        </div>
        <div className='card'>
          <h1 id='dns'>DNS</h1>
          <p>
            Variables:
            <br />
            Dominio = {nombreDeDominio}
            <br />
            Ip del servidor principal = {ipNormal}
            <br />
            Rango IP zona inversa = {IPZonaInversa}
            <br />
            IP del servidor secundario = {ipSecundario}
            <br />
            IP de otro host, en este caso {maestreNombre} = {ipMaestre}
            <br />
            IP del servicio de ftp: {ipFtp}
            <br />
            M??scara= {mascara}
            <br />
          </p>
          <h2 id='dns-ubuntu'>DNS ubuntu</h2>
          <p>La red debe estar la primera en NAT y la segunda interfaz en red interna.
            Configuramos el netplan, que es el archivo que se encuentra en <code>/etc/netplan/</code>, deber??a quedar as??:
          </p>
          <pre>
            <code className='language-yaml'>
              {`network:
  renderer: networkd
  version: 2
  ethernets:
    enp0s3:
      dhcp4: true
    enp0s8:
      dhcp4: false
      addresses: [${ipNormal}/${mascara}]
      nameservers:
        addresses: [${ipNormal}]
        search: [${nombreDeDominio}]
`}
            </code>
          </pre>

          <p>Aplicamos:</p>
          <code className='language-bash'>sudo netplan apply
          </code>

          <p>Y comprobamos:</p>
          <code className='language-bash'>ifconfig
          </code>

          <p>Ahora instalamos el servidor dns:</p>
          <code className='language-bash'>sudo apt-get install bind9 -y
          </code>

          <p>En cuanto al servidor DNS, dos carpetas son las importantes:</p>
          <ul>
            <li><code>/etc/bind/</code></li>
            <li><code>/var/cache/bind/</code></li>
          </ul>
          <p>El archivo a modificar en el <code>/etc/bind/</code> es:</p>
          <ul>
            <li><code>named.conf.local</code></li>
          </ul>
          <p>Ah?? ponemos la zona:</p>
          <pre>
            <code className='language-conf'>
              {`zone "${nombreDeDominio}" {
    type master;
    file "db.${nombreDeDominio}";
};
`}
            </code>
          </pre>

          <p>ahora podemos a??adir, justo debajo de eso, la zona inversa:</p>
          <pre>
            <code className='language-conf'>
              {`zone "${IPZonaInversa}.in-addr.arpa" {
    type master;
    file "db.${IPZonaInversa}";
}
`}
            </code>
          </pre>

          <p>Para comprobar que lo hemos escrito bien lanzamos lo siguiente:</p>
          <code className='language-bash'>named-checkconf
          </code>

          <p>Una vez eso, vamos a configurar el archivo de db que hemos indicado, es decir, el <code>db.{nombreDeDominio}</code>, en <code>/var/cache/bind</code>. Deber??a quedar algo as??:</p>
          <pre>
            <code className='language-conf'>

              {`$ORIGIN ${nombreDeDominio}.
$TTL 3600;

@           IN  SOA ${nombreDeDominio}. admin.${nombreDeDominio}. (
    1   ;Numero de serie o versi??n
    7200;Tiempo de refresco
    3600;Tiempo de espera
    1209600;Tiempo de expiraci??n
    3600;TTL de la zona 
    )

@           IN  NS  principal.${nombreDeDominio}.
            IN  SRV 0 0 21  ftp.${nombreDeDominio}.
principal   IN  A   ${ipNormal}
secundario  IN  A   ${ipSecundario}
${maestreNombre}  IN  A   ${ipMaestre}
ftp         IN  A   ${ipFtp}
`}
            </code>
          </pre>
          <p>Una vez este fichero, configuramos el de la zona inversa, el <code>db.{IPZonaInversa}</code>, en <code>/var/cache/bind</code>.</p>
          <pre>
            <code className='language-conf'>
              {`$ORIGIN ${IPZonaInversa}.in-addr.arpa.
$TTL 3600;

@           IN  SOA ${IPZonaInversa}.in-addr.arpa. admin.${nombreDeDominio}. (
    1   ;Numero de serie o versi??n
    7200;Tiempo de refresco
    3600;Tiempo de espera
    1209600;Tiempo de expiraci??n
    3600;TTL de la zona 
    )

@           IN  NS  principal.${nombreDeDominio}.

${ipInversa}   IN  PTR   principal.${nombreDeDominio}.
${secundarioInversa}    IN  PTR   secundario.${nombreDeDominio}.
${maestreInversa}    IN  PTR   ${maestreNombre}.${nombreDeDominio}.
${ftpInversa}   IN  PTR   ftp.${nombreDeDominio}.
`}

            </code>
          </pre>
          <p>Reiniciamos el servicio:</p>
          <code className='language-bash'>sudo service named restart
          </code>

          <p>Tambi??n valdr??a con el siguiente:</p>
          <code className='language-bash'>sudo service bind9 restart
          </code>

          <p>Ahora comprobamos que est?? todo bien:</p>
          <code className='language-bash'>named-checkzone {nombreDeDominio} /var/cache/bind/db.{nombreDeDominio}
          </code>

          <p>Y la zona inversa:</p>
          <code className='language-bash'>named-checkzone {IPZonaInversa}.in-addr.arpa /var/cache/bind/db.{IPZonaInversa}
          </code>

          <p>Y podemos ver si lo resuelve bien:</p>
          <code className='language-bash'>nslookup {maestreNombre}.{nombreDeDominio}
          </code>

          <p>o</p>
          <code className='language-bash'>host {ipMaestre}
          </code>

          <h3 id='servidor-secundario-ubuntu'>Servidor secundario Ubuntu</h3>
          <p>Para ello, tenemos que modificar las zonas para permitir la transferencia de autoridad en el servidor primario, en el <code>named.conf.local</code> del <code>/etc/bind</code></p>
          <pre>
            <code className='language-conf'>
              {`zone "${nombreDeDominio}" {
    type master;
    file "db.${nombreDeDominio}";
    also-notify {
        ${ipSecundario};
    };
};
zone "${IPZonaInversa}.in-addr.arpa" {
    type master;
    file "db.${IPZonaInversa}";
    also-notify {
        ${ipSecundario};
    };
}
`}
            </code>
          </pre>

          <p>Y restablecemos el servicio:</p>
          <code className='language-bash'>sudo service named restart
          </code>

          <p>Ahora, nos vamos al servidor secundario e instalamos el <code>bind9</code> y configuramos el netplan:</p>
          <pre>
            <code className='language-yaml'>
              {`network:
  renderer: networkd
  version: 2
  ethernets:
    enp0s3:
      dhcp4: true
    enp0s8:
      dhcp4: false
      addresses: [${ipSecundario}/${mascara}]
      nameservers:
        addresses: [${ipSecundario}]
        search: [${nombreDeDominio}]
`}
            </code>
          </pre>

          <p>Y pasamos a editar las zonas en el <code>named.conf.local</code>:</p>
          <pre>
            <code className='language-conf'>
              {`zone "${nombreDeDominio}" {
    type slave;
    file "db.slave.${nombreDeDominio}";
    masters {
        ${ipNormal};
    };
};
zone "${IPZonaInversa}.in-addr.arpa" {
    type slave;
    file "db.slave.${IPZonaInversa}";
    masters {
        ${ipNormal};
    };
}
`}
            </code>
          </pre>

          <p>Comprobamos:</p>
          <code className='language-bash'>named-checkconf
          </code>

          <p>Y reiniciamos ambos servidores, dos veces de forma alterna:</p>
          <ol>
            <li>Secundario</li>
            <li>Primario</li>
            <li>Secundario</li>
            <li>Primario</li>
          </ol>
          <p>As?? nos aseguraremos que se aplica perfectamente la configuraci??n.</p>
          <p>Probamos con <code>nsloockup</code> en el secundario:</p>
          <code className='language-bash'>nslookup principal
          </code>

          <p>Si nos diese problemas alguno de los dos, instalamos el <code>resolvconf</code>:</p>
          <code className='language-bash'>sudo apt-get install resolvconf
          </code>

          <p>Y editamos el archivo de cola, el <code>/etc/resolvconf/resolv.conf/tail</code>:</p>
          <pre>
            <code className='language-conf'>
              {`nameserver ${ipNormal}
search ${nombreDeDominio}`}
            </code>
          </pre>
          <p>Y actualizamos el <code>resolvconf</code>:</p>
          <code className='language-bash'>sudo reolvconf -u
          </code>

          <p>Y comprobamos que lo ha cogido bien:</p>
          <code className='language-bash'>cat /etc/resolv.conf
          </code>

          <h3 id='windows-como-secundario'>Windows como secundario</h3>
          <p>Vamos a Agregar roles y caracter??sticas y agregamos el DNS.
            Una vez instalado, vamos a la opci??n herramientas&gt;DNS
          </p>
          <p>Ah?? iremos a DNS donde vamos al servidor&gt;zona de b??squeda.Haremos clic derecho y le damos a zona nueva.</p>
          <p>Se nos abrir?? un asistente, donde los par??metros que introducimos son:</p>
          <ul>
            <li>Tipo de zona: zona secundaria</li>
            <li>nombre de zona: {nombreDeDominio}</li>
            <li>servidores maestros: {ipNormal}. Le damos a intro y deber??a salir en verde.</li>
          </ul>
          <p>Y ya nos dar??a el resumen y finalizamos, si entramos a la nueva zona veremos los registros de la primaria.</p>
          <h2 id='otros'>Otros</h2>
          <p>Aparte de los registros A, existen:</p>
          <ul>
            <li>SRV:Registro de Servicio que se utiliza para definir el nombre de host y el puerto de un servicio.</li>
            <li>CNAME: Registro de Alias de Servicio que se utiliza para crear un alias para un nombre de dominio existente.
              Por ejemplo, si desea que "subdominio.ejemplo.com" sea un alias para "www.ejemplo.com", puede crear un registro CNAME para "subdominio.ejemplo.com" que apunte a "www.ejemplo.com".
            </li>
            <li>MX: Registro de Mail Exchange que se utiliza para indicar los servidores de correo electr??nico que deben recibir el correo destinado a un dominio en particular.</li>
            <li>TXT: Registro de Texto que se utiliza para almacenar informaci??n arbitraria asociada con un nombre de dominio.</li>
            <li>NS: Registro de Nombres de Servidores que se utiliza para identificar los servidores de nombres autorizados para un dominio en particular.</li>
            <li>AAAA: Registro de Protocolo IPv6 que se utiliza para traducir nombres de dominio en direcciones IPv6.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
