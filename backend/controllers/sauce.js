const { json } = require("body-parser");
//const app = require("../app");
const Sauce = require('../models/modelSauce');
const fs = require('fs');

exports.list = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};
exports.findOne = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(404).json({ error }));

};
exports.insert = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    console.log(sauceObject)

    sauce.save()
        .then(() => res.status(201).json({ message: 'sauce créée !' }))
        .catch(error => res.status(400).json({ error }))
    console.log(sauce);
};
exports.modify = (req, res, next) => {

    Sauce.findOne({ _id: req.params.id })
    if (req.file) {
        Sauce.findOne({ _id: req.params.id })
            .then(Sauce => {
                const filename = Sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, (err) => {
                    if (err) throw err;
                });
            })
            .catch(error => res.status(400).json({ error }));
    }
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
        .catch(error => res.status(400).json({ error }));
};
exports.deleted = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(Sauce => {
            const filename = Sauce.imageUrl.split('/images/')[1];
            fs.unlink(`./images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};
exports.like = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(Sauce => {
            if (req.body.like === 1) {
                Sauce.usersLiked.push(req.body.userId);
                Sauce.likes += 1;
            } else if (req.body.like === -1) {
                Sauce.usersDisliked.push(req.body.userId);
                Sauce.dislikes += 1;
            }
            let usersLikedIndex = Sauce.usersLiked.findIndex(user => user === req.body.userId);
            let usersDislikedIndex = Sauce.usersDisliked.findIndex(user => user === req.body.userId);
            if (req.body.like === 0 && usersLikedIndex != -1) {
                console.log(usersLikedIndex);
                Sauce.usersLiked.splice(usersLikedIndex, 1);
                Sauce.likes -= 1;
            } else if (req.body.like === 0 && usersDislikedIndex != -1) {
                console.log(usersDislikedIndex);
                Sauce.usersDisliked.splice(usersDislikedIndex, 1);
                Sauce.dislikes -= 1;
            }
            Sauce.save();
            res.status(201).json({ message: 'Like mise à jour' });
        })
};