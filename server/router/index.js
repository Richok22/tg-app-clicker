const Router = require ('express').Router;
const userController = require('../controllers/userController');

const router = new Router();

router.post('/register', userController.registration)
router.get('/load/:id', userController.load); // Change to /load/:tgId
router.post('/tasks', )

module.exports = router;