// Load the controller
const service = require('./service.js');

// Route definitions (endpoints)
module.exports = (app) => {
    app.post('/users', service.create_user);
    app.get('/posts/:pid([0-9]+)/comments', service.read_comments);
    app.put('/posts', service.update_post);
    app.delete('/comments/:cid([0-9]+)', service.delete_comment);
}