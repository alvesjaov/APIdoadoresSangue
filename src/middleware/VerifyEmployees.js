import passport from 'passport';

// Função assíncrona para verificar se o usuário é um administrador
async function verifyAdmin(req, res, next) {
  // Autenticando o usuário com a estratégia 'jwt'
  passport.authenticate('jwt-admin', { session: false }, (err, adminEmployee) => {
    // Se houver um erro durante a autenticação, retorna uma mensagem de erro
    if (err) {
      return res.status(500).json({ message: 'Erro interno do servidor. Não foi possível autenticar usando a estratégia jwt.' });
    }
    // Se o usuário não for um administrador, retorna uma mensagem de acesso negado
    if (!adminEmployee) {
      return res.status(401).json({ message: 'Acesso negado.' });
    }
    // Se tudo estiver ok, prossegue para a próxima função no middleware
    next();
  })(req, res, next);
}

// Verifica se o usuário é um administrador ou um funcionário
async function verifyAdminOrEmployee(req, res, next) {
  passport.authenticate(['jwt-admin', 'jwt-employee'], { session: false }, (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
    if (!user) {
      return res.status(401).json({ message: 'Acesso negado.' });
    }
    next();
  })(req, res, next);
}


// Exportando as funções para serem usadas em outros módulos
export { verifyAdmin, verifyAdminOrEmployee };