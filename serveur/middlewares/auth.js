const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.sendStatus(403);
    }

    jwt.verify(token, 'votre_clé_secrète', (err, user) => {
        if (err) {
            console.error('Token verification error:', err);
            return res.sendStatus(403);
        }

        req.user = user;
        console.log('Decoded Token:', user); // Assurez-vous que userId et userType sont présents
        next();
    });
};
