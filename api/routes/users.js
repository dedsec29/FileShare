const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const UsersController = require('../controllers/users');

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Handling GET requests to /users' });
});

//create new user
router.post('/signup', UsersController.createUser);

/*  Display all users (For future: Remember to not display password of users.
    Also display selective details if user 'Access' is private) */
router.get('/all', UsersController.displayUsers);

//delete a user, also all its repositories too
router.delete('/:userID', checkAuth, UsersController.deleteUser);

//update user details. If userID itself is changed, reflect the changes on Repository model as well
router.put('/:userID', checkAuth, UsersController.updateUser);

router.post('/login', UsersController.login);

module.exports = router;
