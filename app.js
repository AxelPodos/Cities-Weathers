// NPM DOTENV para el manejo de las variables de entorno (en este caso del token) 
require('dotenv').config()

// Para ver las variables de entorno: console.log(process.env) o console.log(process.env.MAPBOX_KEY)

// NPM AXIOS para realizar peticiones http
const axios = require('axios')

const { menu, pausa, leerInput, listarLugares } = require("./helpers/inquirer");

const Busquedas = require("./models/busquedas");


const main = async() => {

    const busquedas = new Busquedas()

    let opcion

    do {

        opcion = await menu()
        
        switch (opcion) {
            case 1:
                // Mostrar mensaje
                const termino = await leerInput('Ciudad: ')

                // Buscar los lugares en base al input user
                const lugares = await busquedas.getCiudad(termino)

                // Seleccionar el lugar
                const id = await listarLugares(lugares)
                if (id === '0') continue
                const lugarSeleccionado = lugares.find(lugar => lugar.id === id)
                
                // Guardado de lugares
                busquedas.agregarHistorial(lugarSeleccionado.nombre)

                // Clima
                const clima = await busquedas.getClima(lugarSeleccionado.lat, lugarSeleccionado.long)

                // Mostrar resultados (MapBox API)
                console.log('\nInformacion de la ciudad\n'.underline.yellow)
                console.log('Ciudad:', lugarSeleccionado.nombre.yellow)
                console.log('Latitud:', lugarSeleccionado.lat)
                console.log('Longitud:', lugarSeleccionado.long)

                // Datos del clima (OpenWeather API)
                console.log('Temperatura:', clima.temp)
                console.log('T° Minima:', clima.min)
                console.log('T° Maxima:', clima.max)
                console.log('Descripcion:', clima.descripcion.yellow)
            
            break;
        
            case 2:
                // Muestra lugares guardados
                busquedas.historialCapitalizado.forEach((lugar, i) =>{
                    const index = `${i + 1}`
                    console.log(`${index} ${lugar}`);
                })
            break;
        }

        if (opcion !== 0) await pausa()
        
    } while (opcion !== 0);


}

main()