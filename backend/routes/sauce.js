const express = require('express');
const router = express.Router();
const sauce = require('../controllers/sauce');
const multer = require('../middleware/multer-config');

router.get('/', sauce.list)
router.get('/:id', sauce.findOne)
router.post('/', multer, sauce.insert)
router.delete('/:id', sauce.deleted)
router.put('/:id', multer, sauce.modify)
router.post('/:id/like', sauce.like)

module.exports = router