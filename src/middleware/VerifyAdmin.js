import passport from 'passport';// Importa o passport

async function verifyAdmin(req, res, next) {
    passport.authenticate('jwt', { session: false }, (err, employee, info) => {
      if (err || !employee) {
        return res.status(401).json({ message: 'Acesso negado.' });
      }
      next();
    })(req, res, next);
}

export default verifyAdmin; // Exporta a função verifyAdmin como padrão