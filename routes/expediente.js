var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Expediente = require('../models/expediente');

// ------------------------------
// Obtener todos los expedientes
// ------------------------------
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Expediente.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'noEmpleado nombre usuario')
        .exec(
            (err, expedientes) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error cargando expedientes',
                        errors: err

                    });
                }

                Expediente.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        expedientes: expedientes,
                        total: conteo
                    });
                });


            });

});

// ------------------------------
// Actualizar expediente
// ------------------------------
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Expediente.findById(id, (err, expediente) => {
        var body = req.body;

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar expediente',
                errors: err

            });
        }

        if (!expediente) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El expediente con el id ' + id + ' no existe',
                errors: { message: 'No existe un expediente con ese ID' }

            });
        }

        expediente.noEmpleado = body.noEmpleado;
        expediente.nombre = body.nombre;
        expediente.apellido = body.apellido;
        expediente.nombramiento = body.nombramiento;
        expediente.actaProtesta = body.actaProtesta;
        expediente.designacion = body.designacion;
        expediente.oficioComision = body.oficioComision;
        expediente.descripcionPuesto = body.descripcionPuesto;
        expediente.cartillaMilitar = body.cartillaMilitar;
        expediente.escolaridad = body.escolaridad;
        expediente.solicitudEmpleo = body.solicitudEmpleo;
        expediente.noAntecedentes = body.noAntecedentes;
        expediente.noInhabilitacion = body.noInhabilitacion;
        expediente.rfc = body.rfc;
        expediente.curp = body.curp;
        expediente.actaNacimiento = body.actaNacimiento;
        expediente.examenTox = body.examenTox;
        expediente.cerMedico = body.cerMedico;
        expediente.antAdvos = body.antAdvos;
        expediente.foto = body.foto;
        expediente.renuncia = body.renuncia;
        expediente.usuario = req.usuario._id;

        expediente.save((err, expedienteGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error al actualizar expedientes',
                    errors: err

                });
            }

            res.status(200).json({
                ok: true,
                expediente: expedienteGuardado
            });
        });
    });
});


// ------------------------------
// Crear expedientes
// ------------------------------
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var expediente = new Expediente({
        noEmpleado: body.noEmpleado,
        nombre: body.nombre,
        apellido: body.apellido,
        nombramiento: body.nombramiento,
        actaNacimiento: body.actaNacimiento,
        designacion: body.designacion,
        oficioComision: body.oficioComision,
        descripcionPuesto: body.descripcionPuesto,
        cartillaMilitar: body.cartillaMilitar,
        escolaridad: body.escolaridad,
        solicitudEmpleo: body.solicitudEmpleo,
        noAntecedentes: body.noAntecedentes,
        noInhabilitacion: body.noInhabilitacion,
        examenTox: body.examenTox,
        cerMedico: body.cerMedico,
        antAdvos: body.antAdvos,
        foto: body.foto,
        renuncia: body.renuncia,
        usuario: body.usuario


    });

    expediente.save((err, expedienteGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al crear expedientes',
                errors: err

            });
        }
        res.status(201).json({
            ok: true,
            expediente: expedienteGuardado
        });

    });

});

// ------------------------------
// borrar expediente por id
// ------------------------------
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Expediente.findByIdAndRemove(id, (err, expedienteBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al borrar expediente',
                errors: err

            });
        }

        if (!expedienteBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un expediente con ese id',
                errors: { message: 'No existe un expediente con ese id' }

            });
        }
        res.status(200).json({
            ok: true,
            expediente: expedienteBorrado
        });


    });
});

module.exports = app;