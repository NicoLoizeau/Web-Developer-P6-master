const express = require('express');
const router = express.Router();
const sauce = require('../controllers/sauce')

router.get('/', sauce.list)
router.get('/:id', sauce.findOne)
router.post('/', sauce.insert)
router.delete('/:id', sauce.deleted)
router.put('/:id', sauce.modify)
router.post('/:id/like', sauce.like)

module.exports = router