import mongoose from 'mongoose';

const employeeSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    name: {
        type: String,
        required: true,
        not: null,
        unique: true
    },
    employeeCode: {
        type: Number,
        required: true,
        not: null
    },
    password: {
        type: String,
        required: true,
        not: null
    },
    isAdmin: { // Novo campo para indicar se o funcionário é um administrador
        type: Boolean,
        default: false // O padrão é 'false', ou seja, o funcionário não é um administrador
    }
}, { versionKey: false });

export default mongoose.model('Employee', employeeSchema);
