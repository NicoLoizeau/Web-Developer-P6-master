const express = require('express');
const router = express.Router();
const sauce = require('../controllers/sauce');
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth')

router.get('/', auth, sauce.list)
router.get('/:id', auth, sauce.findOne)
router.post('/', auth, multer, sauce.insert)
router.delete('/:id', auth, sauce.deleted)
router.put('/:id', auth, multer, sauce.modify)
router.post('/:id/like', auth, sauce.like)

module.exports = router