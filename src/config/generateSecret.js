// no terminal node generateSecret.js

import fs from 'fs';
import crypto from 'crypto';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Gera uma chave secreta aleatória
const secret = crypto.randomBytes(64).toString('hex');

// Define o caminho para o arquivo .env na raiz do projeto
const envPath = path.join(__dirname, '../../.env');

// Verifica se o arquivo .env existe, se não, cria um
if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, '');
}

// Lê o conteúdo do arquivo .env
let envContent = fs.readFileSync(envPath, 'utf8');

// Verifica se JWT_SECRET já existe no arquivo .env
let lines = envContent.split('\n');
let index = lines.findIndex(line => line.startsWith('JWT_SECRET='));

if (index !== -1) {
  // Substitui o valor existente de JWT_SECRET
  lines[index] = `JWT_SECRET=${secret}`;
} else {
  // Adiciona a chave secreta ao arquivo .env
  lines.push(`JWT_SECRET=${secret}`);
}

// Escreve o conteúdo atualizado de volta para o arquivo .env
fs.writeFileSync(envPath, lines.join('\n'));
console.log('Chave secreta gerada com sucesso!');
