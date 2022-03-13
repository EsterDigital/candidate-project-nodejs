const lokijsController = require('../controllers').loki;

module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the Fluid Contact API!',
    }));

    app.get('/api/user/list', lokijsController.listUsers);
    app.get('/api/post/list', lokijsController.getUserPost);
    app.get('/api/post/comments', lokijsController.getPostComment);

    app.post('/api/user/create', lokijsController.createUser);
    app.post('/api/post/create', lokijsController.createPosts);
    app.post('/api/comment/create', lokijsController.createComments);

    app.patch('/api/post/:postId', lokijsController.updatePost);
    app.delete('/api/comment/:commentId', lokijsController.deleteComment);
    
};