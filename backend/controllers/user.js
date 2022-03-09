const bcrypt = require('bcrypt');
const user = require('../models/userModel');


exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.pasword, 10)
        .then(hash => {
            const user = new user({
                email: req.body.email,
                pasword: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'utilisateur créé' }))
                .catch(() => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ message: 'Inscription impossible !' }));
};

exports.login = (req, res, next) => {
    user.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'utilisateur non trouvé 1 !' });
            }
            bcrypt.compare(req.body.pasword, user.pasword)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user.id,
                        token: 'TOKEN'
                    });
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
};