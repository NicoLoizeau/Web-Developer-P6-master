const { json } = require("body-parser");
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
    sauce.save()
        .then(() => res.status(201).json({ message: 'sauce créée !' }))
        .catch(error => res.status(400).json({ error }))
};
exports.modify = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            if (req.file) {
                fs.unlink(`images/${filename}`, (err) => {
                    if (err) throw err;
                })
            }
            const sauceObject = req.file ?
                {
                    ...JSON.parse(req.body.sauce),
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                } : { ...req.body };
            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
                .catch(error => res.status(400).json({ error }));
        })
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
        .then(result => {
            let sauce = { ...JSON.parse(JSON.stringify(result)) }
            if (!sauce.usersLiked) { sauce.usersLiked = [] }
            if (!sauce.usersDisliked) { sauce.usersDisliked = [] }
            let usersLikedIndex = sauce.usersLiked.findIndex(user => user === req.body.userId);
            let usersDislikedIndex = sauce.usersDisliked.findIndex(user => user === req.body.userId);
            if (req.body.like === 1 && usersLikedIndex === -1) {
                sauce.usersLiked.push(req.body.userId);
                sauce.likes += 1;
            } else if (req.body.like === -1 && usersDislikedIndex === -1) {
                sauce.usersDisliked.push(req.body.userId);
                sauce.dislikes += 1;
            } else if (req.body.like === 0 && usersLikedIndex != -1) {
                sauce.usersLiked.splice(usersLikedIndex, 1);
                sauce.likes -= 1;
            } else if (req.body.like === 0 && usersDislikedIndex != -1) {
                sauce.usersDisliked.splice(usersDislikedIndex, 1);
                sauce.dislikes -= 1;
            } else;
            Sauce.updateOne({ _id: req.params.id }, { ...sauce, _id: req.params.id })
                .then(() => res.status(201).json({ message: 'like sauce modifié' }))
                .catch(error => res.status(400).json({ error }));
        })
};