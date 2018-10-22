var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var expedienteSchema = new Schema({

    noEmpleado: { type: String, required: false },
    nombre: { type: String, required: false },
    apellido: { type: String, required: false },
    nombramiento: { type: String, required: false },
    actaProtesta: { type: String, required: false },
    designacion: { type: String, required: false },
    oficioComision: { type: String, required: false },
    descripcionPuesto: { type: String, required: false },
    cartillaMilitar: { type: String, required: false },
    escolaridad: { type: String, required: false },
    solicitudEmpleo: { type: String, required: false },
    noAntecedentes: { type: String, required: false },
    noInhabilitacion: { type: String, required: false },
    rfc: { type: String, required: false },
    curp: { type: String, required: false },
    actaNacimiento: { type: String, required: false },
    examenTox: { type: String, required: false },
    cerMedico: { type: String, required: false },
    antAdvos: { type: String, required: false },
    foto: { type: String, required: false },
    renuncia: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'expedientes' });

module.exports = mongoose.model('Expediente', expedienteSchema);