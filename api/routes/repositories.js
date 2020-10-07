const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const RepositoriesController = require('../controllers/repositories');

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Handling GET requests to /repositories' });
});

//creating new repo
router.post('/:userID', checkAuth, RepositoriesController.createRepo);

//display all repositories
router.get('/all', RepositoriesController.displayRepos);

//delete a repository
router.delete(
  '/:userID/:repoName',
  checkAuth,
  RepositoriesController.deleteRepo
);

//update repository details
router.put('/:userID/:repoName', checkAuth, RepositoriesController.updateRepo);

module.exports = router;
