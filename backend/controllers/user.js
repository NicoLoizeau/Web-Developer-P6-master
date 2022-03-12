const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');


exports.signup = (req, res, next) => {
    console.log(req.body)
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'utilisateur créé' }))
                .catch(() => res.status(400).json({ message: 'Cette adresse mail existe déjà !' }));
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ message: 'Inscription impossible !' })
        });
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(User => {
            if (!User) {
                return res.status(401).json({ error: 'utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, User.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: User.id,
                        token: jwt.sign(
                            { userId: User._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '12h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ message: 'ça marche pas :(' }))
        })
        .catch(error => res.status(500).json({ error }))
};