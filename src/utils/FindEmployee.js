import Employee from '../models/Employee.js';
import mongoose from 'mongoose';

// Função auxiliar para buscar funcionário por código ou nome
async function findEmployeeByCodeOrName(codeOrName) {
    let employee;
    
    // Primeiro, tente buscar pelo código
    if (codeOrName.length === 6) {
        employee = await Employee.findOne({ employeeCode: Number(codeOrName) });
    }
    
    // Se nenhum funcionário foi encontrado, tente buscar pelo nome
    if (!employee) {
        employee = await Employee.findOne({ name: { $regex: '^' + codeOrName, $options: 'i' } });
    }
    
    return employee;
}

export { findEmployeeByCodeOrName };