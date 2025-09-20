const{register, getoneUser} = require('../controllers/user')
const uploads = require('../middleware/multer');
const router = require('express').Router()


router.post('/register', uploads.single('profilePicture'), register);
router.get('/:id', getoneUser);

module.exports = router;
