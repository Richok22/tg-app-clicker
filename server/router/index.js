const Router = require ('express').Router;
const userController = require('../controllers/userController');
const taskController = require('../controllers/taskController');


const router = new Router();

router.post('/register', userController.registration);
router.get('/load/:id', userController.load);
router.get('/referral/:referralCode', userController.referral); // Change to /load/:tgId
router.get('/friends/:id', userController.fetchFriends);
router.get('/tasks',taskController.fetchTasks);
router.get('/checkTasks',taskController.fetchTasks);
router.post('/complete',taskController.completeTask);

module.exports = router;