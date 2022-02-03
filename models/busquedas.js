const axios = require('axios')

const fs = require('fs')

class Busquedas {

    historial = []

    dbPath = './db/database.json'

    constructor() {
        this.leerDB()
    }

    // Devuelve params del request API MapBox
    get paramsMapBox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    get paramsWeather() {
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'
        }
    }

    // Imprime el historial con mayusculas. Mapea el lugar y capitaliza la primer letra de cada palabra
    get historialCapitalizado() {
        return this.historial.map(lugar =>{

            let palabras = lugar.split(' ')
            palabras = palabras.map(palabra => palabra[0].toUpperCase() + palabra.substring(1))

            return palabras.join(' ')

        })
    }

    async getCiudad(lugar = '') {

        try {
            // Instancia AXIOS
            const instancia = axios.create({
                baseURL : `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`, 
                params: this.paramsMapBox
            })

            // Peticion GET
            const respuesta = await instancia.get()
            
            // Extraemos mapeando las propiedades que queremos mostrar. ({}) Devuelve objeto
            return respuesta.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                long: lugar.center[0],
                lat: lugar.center[1]
            }))

        } catch (error) {
            return []
        }
    }

    async getClima(lat, lon) {

        try {
            const instancia = axios.create({
                baseURL : `https://api.openweathermap.org/data/2.5/weather`, 
                // Desestructuramos el getter para mandar las propiedades adicionales
                params: { ...this.paramsWeather, lat, lon }
            })

            const respuesta = await instancia.get()

            // Extraemos solo los datos del json de la respuesta que nos interesa
            const {weather, main} = respuesta.data

            return {
                descripcion: weather[0].description,
                temp: main.temp,
                min: main.temp_min,
                max: main.temp_max
            }
        }

        catch (error) {
            console.log(error);
        }
    }

    // Persiste ciudades en array
    agregarHistorial(lugar = '',) {

        // Si la ciudad esta en el array, no se vuelve a guardar (evita duplicado)
        if (this.historial.includes(lugar.toLowerCase())) {
            return
        }

        this.historial.unshift(lugar.toLowerCase())

        this.guardarDB()
    }

    // Escritura archivo json
    guardarDB() {

        const payload = {
            historial: this.historial
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }

    // Lectura archivo json
    leerDB() {

        if(!fs.existsSync(this.dbPath)) {
            return
        }

        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'})
        const data = JSON.parse(info)

        this.historial = data.historial
    }

}

module.exports = Busquedas