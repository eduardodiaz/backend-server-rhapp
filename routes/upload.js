var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Expediente = require('../models/expediente');

// default options
app.use(fileUpload());

// Rutas
app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;
    // var exptipo = req.params.exptipo;

    // documentos en expedientes validos
    /* var ExpValidos = ['nombramiento', 'actaProtesta', 'designacion'];

    if (ExpValidos.indexOf(exptipo) < 0){
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de documento no valido en coleccion',
            errors: { message: 'Tipo de documento no valido en coleccion' }
        });

    } */


    // tipos de coleccion
    var tiposValidos = ['usuarios', 'expedientes'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no valido',
            errors: { message: 'Tipo de coleccion no valido' }
        });

    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe de seleccionar una imagen' }
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Solo estas extensiones aceptamos
    var extensionesValidas = ['pdf', 'jpg', 'png', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Las extensiones validas son ' + extensionesValidas.join(' , ') }
        });

    }

    // Nombre de archivo personalizado
    // 123123132321321-123.png
    var nombreArchivo = `${ id }-${new Date().getMilliseconds()}.${extensionArchivo}`;



    // Mover el archivo del temporal al path
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover el archivo',
                errors: err
            });
        }


        subirPorTipo(tipo, id, nombreArchivo, res);

    });


});

function subirPorTipo(tipo, id, nombreArchivo, res) {


    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {
                usuarioActualizado.password = 'XD';
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario Actualizada',
                    usuario: usuarioActualizado
                });

            })

        });
    }

    if (tipo === 'expedientes') {


        Expediente.findById(id, (err, expediente) => {

            if (!expediente) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Expediente no existe',
                    errors: { message: 'Expediente no existe' }
                });
            }

            var pathViejo = './uploads/expedientes/' + expediente.nombramiento;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            expediente.nombramiento = nombreArchivo;

            expediente.save((err, expedienteActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de expediente Actualizada',
                    expediente: expedienteActualizado
                });

            })

        });

    }
}

module.exports = app;