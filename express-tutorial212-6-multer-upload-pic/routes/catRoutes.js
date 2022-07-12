const express = require('express');
const catControllers  = require('../controllers/catControllers');
const authControllers  = require('../controllers/authControllers');
const router = express.Router();

router.route('/')
.get(catControllers.getCats)
.post(catControllers.createCat)


router.route('/:id')
.get(authControllers.protect, catControllers.getCat)



module.exports = router;