const inquirer = require('inquirer')

require('colors')

const opciones = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Que desea hacer?'.blue,
        choices: [
            {
                value: 1,
                name: `${'1.'} Buscar Ciudad`
            },
            {
                value: 2,
                name: `${'2.'} Historial`
            },
            {
                value: 0,
                name: `${'0.'} Salir`
            }
        ]
    }
];

const menu = async() => {

    console.clear()
    console.log('========================='.blue)
    console.log('  Seleccione una opcion  '.blue)
    console.log('=========================\n'.blue)

    const { opcion } = await inquirer.prompt(opciones)
   
    return opcion
}

const pausa = async() => {

    const mensaje = [
        {
            type: 'input',
            name: 'enter',
            message: (`Presiona ENTER para continuar`.blue)
        }
    ]
    
    console.log('\n')
    await inquirer.prompt(mensaje)
}

const leerInput = async(mensaje) => {

    const pregunta = [
        {
            type: 'input',
            name: 'descripcion',
            mensaje,
            validate(value) {
                if (value.length === 0) {
                    return 'Por favor ingrese un valor'.red.bold
                } 
                return true
            }
        }
    ]
    
    const { descripcion } = await inquirer.prompt(pregunta)

    return descripcion
}

const listarLugares = async(lugares = []) => {

    const choices = lugares.map((lugar, i) => {

        const index = `${i + 1}.`.blue
        
        return {
            value: lugar.id,
            name: `${index} ${lugar.nombre}`
        }
    })

    choices.unshift({
        value: '0',
        name: '0. Cancelar'.red.bold
    })

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar:',
            choices
        }
    ]

    const { id } = await inquirer.prompt(preguntas)
    
    return id  
}

module.exports = {
    menu,
    pausa,
    leerInput,
    listarLugares
}
