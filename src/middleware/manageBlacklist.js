// Inicializa a lista negra de tokens como um array vazio
let blacklistedTokens = [];

// Função para adicionar um token à lista negra
function addToBlacklist(token) {
  // Adiciona o token ao final do array blacklistedTokens
  blacklistedTokens.push(token);
}

// Função para verificar se um token está na lista negra
function isTokenBlacklisted(token) {
  // Verifica se o token está presente no array blacklistedTokens
  return blacklistedTokens.includes(token);
}

// Função para verificar se um token está na lista negra
function checkBlacklistedToken(request, response, next) {
  // Extrai o token do cabeçalho de autorização
  const token = request.headers.authorization.split(' ')[1];
  // Se o token estiver na lista negra, retorna um erro
  if (isTokenBlacklisted(token)) {
    return response.status(401).json({ error: 'Token inválido ou expirado.' });
  }
  // Se o token não estiver na lista negra, passa para o próximo middleware ou rota
  next();
}

export { addToBlacklist, checkBlacklistedToken };