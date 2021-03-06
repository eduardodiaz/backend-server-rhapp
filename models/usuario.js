var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};

var usuarioSchema = new Schema({

    noEmpleado: { type: Number, required: [true, 'El Numero de empleado es necesario'] },
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    apellidos: { type: String, required: [true, 'El apellido es necesario'] },
    usuario: { type: String, unique: true, required: [true, 'El Usuario es necesario'] },
    password: { type: String, required: [true, 'La contraseña es necesaria'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'ADMIN_ROLE', enum: rolesValidos }

});

usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} debe ser unico' });

module.exports = mongoose.model('Usuario', usuarioSchema);