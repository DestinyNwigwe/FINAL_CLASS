<<<<<<< HEAD
const{register, login, forgetPassword,home} = require('../controllers/user')
=======
const{register, getOne, getAll}= require('../controllers/user');
>>>>>>> 52fadcbf84d6dd84871cfac8089b31fe97168fd4
const uploads = require('../middleware/multer');
const router = require('express').Router()


<<<<<<< HEAD
router.post("/register", uploads.single('profilePicture'), register);
// router.get('/:id', getoneUser);

router.post('/login',login);
router.get("/",home);
router.post("/password",forgetPassword);


=======
router.post('/register', uploads.single('profilePicture'), register);
router.get('/user/:id', getOne);
router.get('/user', getAll)
>>>>>>> 52fadcbf84d6dd84871cfac8089b31fe97168fd4

module.exports = router;
