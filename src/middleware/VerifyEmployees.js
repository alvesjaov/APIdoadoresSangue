import passport from 'passport';

// Função assíncrona para verificar se o usuário é um administrador
async function verifyAdmin(req, res, next) {
  // Autenticando o usuário com a estratégia 'jwt'
  passport.authenticate('jwt', { session: false }, (err, adminEmployee) => {
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

// Função assíncrona para verificar se o usuário é um funcionário
async function verifyEmployee(req, res, next) {
  // Autenticando o usuário com a estratégia 'jwt-employee'
  passport.authenticate('jwt-employee', { session: false }, (err, employee) => {
    // Se houver um erro durante a autenticação, retorna uma mensagem de erro
    if (err) {
      return res.status(500).json({ message: 'Erro interno do servidor. Não foi possível autenticar usando a estratégia jwt-employee.', error: err.toString() });
    }
    // Se o usuário não for um funcionário, retorna uma mensagem de acesso negado
    if (!employee) {
      return res.status(401).json({ message: 'Acesso negado.' });
    }
    // Se tudo estiver ok, anexa o objeto do funcionário ao objeto de solicitação e prossegue para a próxima função no middleware
    req.employee = employee;
    next();
  })(req, res, next);
}

// Exportando as funções para serem usadas em outros módulos
export {verifyAdmin, verifyEmployee};