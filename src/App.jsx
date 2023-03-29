import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Formulario from '../components/Formulario'

function App () {
  const [dns, setDns] = useState(
    {
      nombreDeDominio: 'dominio.asir2',
      ipNormal: '10.8.23.5',
      ipInversa: '5.23',
      IPZonaInversa: '8.10',
      ipSecundario: '10.8.23.7',
      secundarioInversa: '7.23',
      ipMaestre: '10.8.23.9',
      maestreInversa: '9.23',
      maestreNombre: 'maestre',
      ipFtp: '10.8.23.15',
      ftpInversa: '15.23',
      mascara: '16'
    }
  )
  const {
    nombreDeDominio,
    ipNormal,
    ipInversa,
    IPZonaInversa,
    ipSecundario,
    secundarioInversa,
    ipMaestre,
    maestreInversa,
    maestreNombre,
    ipFtp,
    ftpInversa,
    mascara
  } = dns
  // formulario
  function data (result) {
    setDns(result)
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
          Genera tu tutorial de DNS personalizado:
          <Formulario data={data} />
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
            Máscara= {mascara}
            <br />
          </p>
          <h2 id='dns-ubuntu'>DNS ubuntu</h2>
          <p>La red debe estar la primera en NAT y la segunda interfaz en red interna.
            Configuramos el netplan, que es el archivo que se encuentra en <code>/etc/netplan/</code>, debería quedar así:
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
          <p>Ahí ponemos la zona:</p>
          <pre>
            <code className='language-conf'>
              {`zone "${nombreDeDominio}" {
    type master;
    file "db.${nombreDeDominio}";
};
`}
            </code>
          </pre>

          <p>ahora podemos añadir, justo debajo de eso, la zona inversa:</p>
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

          <p>Una vez eso, vamos a configurar el archivo de db que hemos indicado, es decir, el <code>db.{nombreDeDominio}</code>, en <code>/var/cache/bind</code>. Debería quedar algo así:</p>
          <pre>
            <code className='language-conf'>

              {`$ORIGIN ${nombreDeDominio}.
$TTL 3600;

@           IN  SOA ${nombreDeDominio}. admin.${nombreDeDominio}. (
    1   ;Numero de serie o versión
    7200;Tiempo de refresco
    3600;Tiempo de espera
    1209600;Tiempo de expiración
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
    1   ;Numero de serie o versión
    7200;Tiempo de refresco
    3600;Tiempo de espera
    1209600;Tiempo de expiración
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

          <p>También valdría con el siguiente:</p>
          <code className='language-bash'>sudo service bind9 restart
          </code>

          <p>Ahora comprobamos que esté todo bien:</p>
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
          <p>Así nos aseguraremos que se aplica perfectamente la configuración.</p>
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
          <p>Vamos a Agregar roles y características y agregamos el DNS.
            Una vez instalado, vamos a la opción herramientas&gt;DNS
          </p>
          <p>Ahí iremos a DNS donde vamos al servidor&gt;zona de búsqueda.Haremos clic derecho y le damos a zona nueva.</p>
          <p>Se nos abrirá un asistente, donde los parámetros que introducimos son:</p>
          <ul>
            <li>Tipo de zona: zona secundaria</li>
            <li>nombre de zona: {nombreDeDominio}</li>
            <li>servidores maestros: {ipNormal}. Le damos a intro y debería salir en verde.</li>
          </ul>
          <p>Y ya nos daría el resumen y finalizamos, si entramos a la nueva zona veremos los registros de la primaria.</p>
          <h2 id='otros'>Otros</h2>
          <p>Aparte de los registros A, existen:</p>
          <ul>
            <li>SRV:Registro de Servicio que se utiliza para definir el nombre de host y el puerto de un servicio.</li>
            <li>CNAME: Registro de Alias de Servicio que se utiliza para crear un alias para un nombre de dominio existente.
              Por ejemplo, si desea que "subdominio.ejemplo.com" sea un alias para "www.ejemplo.com", puede crear un registro CNAME para "subdominio.ejemplo.com" que apunte a "www.ejemplo.com".
            </li>
            <li>MX: Registro de Mail Exchange que se utiliza para indicar los servidores de correo electrónico que deben recibir el correo destinado a un dominio en particular.</li>
            <li>TXT: Registro de Texto que se utiliza para almacenar información arbitraria asociada con un nombre de dominio.</li>
            <li>NS: Registro de Nombres de Servidores que se utiliza para identificar los servidores de nombres autorizados para un dominio en particular.</li>
            <li>AAAA: Registro de Protocolo IPv6 que se utiliza para traducir nombres de dominio en direcciones IPv6.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
