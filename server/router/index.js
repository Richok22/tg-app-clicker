const Router = require ('express').Router;
const userController = require('../controllers/userController');

const router = new Router();

router.post('/register', userController.registration);
router.get('/load/:id', userController.load);
router.get('/referral/:referralCode', userController.referral); // Change to /load/:tgId
router.post('/tasks', );
router.get('/friends/:id', userController.fetchFriends);

module.exports = router;