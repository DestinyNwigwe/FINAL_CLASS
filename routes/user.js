const{register, login, forgetPassword,home} = require('../controllers/user')
const uploads = require('../middleware/multer');
const router = require('express').Router()


router.post("/register", uploads.single('profilePicture'), register);
// router.get('/:id', getoneUser);

router.post('/login',login);
router.get("/",home);
router.post("/password",forgetPassword);



module.exports = router;
