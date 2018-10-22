var express = require('express');

var app = express();

var Expediente = require('../models/expediente');
var Usuario = require('../models/usuario');

// Rutas


// ----------------------------------------
// Busqueda especifica por coleccion
// ----------------------------------------
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;

    var regexp = new RegExp(busqueda, 'i');


    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regexp);
            break;

        case 'expedientes':
            promesa = buscarExpedientes(busqueda, regexp);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda solo son: usuarios y expedientes',
                error: { message: 'Tipo de tabla/coleccion no valido' }
            });

    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data
        });


    })
});


// ----------------------------------------
// Busqueda general
// ----------------------------------------
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regexp = new RegExp(busqueda, 'i');

    Promise.all([
            buscarExpedientes(busqueda, regexp),
            buscarUsuarios(busqueda, regexp)
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                expedientes: respuestas[0],
                usuarios: respuestas[1]
            });
        });

});

function buscarExpedientes(busqueda, regexp) {

    return new Promise((resolve, reject) => {

        Expediente.find({ nombre: regexp })
            .populate('usuario', 'nombre noEmpleado')
            .exec((err, expedientes) => {

                if (err) {
                    reject('Error al cargar expedientes', err);

                } else {
                    resolve(expedientes);
                }
            });

    });
}

function buscarUsuarios(busqueda, regexp) {

    return new Promise((resolve, reject) => {


        //Expediente.find({}, 'nombre noEmpleado')  aqui se determinan que campos mostrar en la consulta.
        Expediente.find({ nombre: regexp })
            .populate('usuario', 'nombre noEmpleado')
            .exec(
                (err, expedientes) => {

                    if (err) {
                        reject('Error al cargar expedientes', err);

                    } else {
                        resolve(expedientes);
                    }
                });

        /* Usuario.find()
            .or([{ 'noEmpleado': regexp }, { 'usuario': regexp }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuario sadddddddddddddddddd', err);
                } else {
                    resolve(usuarios);
                }
            }) */
    });
}

module.exports = app;