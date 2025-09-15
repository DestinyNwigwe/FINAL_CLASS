const{register, getOne, getAll}= require('../controllers/user');
const uploads = require('../middleware/multer');
const router = require('express').Router()


router.post('/register', uploads.single('profilePicture'), register);
router.get('/user/:id', getOne);
router.get('/user', getAll)

module.exports = router;
