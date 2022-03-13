const fs = require('fs');
const loki = require('lokijs');
const db = new loki('candidate-project-nodejs.json');

module.exports = {

    //method to create users
    createUser(req, res) {

        let token = req.headers['token'] || req.headers['x-access-token'];

        if (!token) {
            return res.status(403).send({ auth: false, message: 'No auth token provided.' });
        } else {
                const users = db.addCollection('users', { indices: ['id'] });
            users.ensureUniqueIndex('id');    
        
            const geo = {
                lat: req.body.lat,
                lng: req.body.lng,
            };

            const address = {
                street: req.body.street,
                city: req.body.city,
                zipcode: req.body.zipcode,
                geo: geo,
            };
            
            const userData = {
                id: req.body.id,
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                address: address,
                phoneNumbers: req.body.phoneNumbers,
                website: req.body.website,
            }

            try{
                users.insert(userData);

                result = users.find();

                return res.status(200).json({data: result, status: 200});   
            }catch(e){
                return res.status(500).json({message: e, status: 500});
            }
        }
        
    },

    //listing all users
    listUsers(req, res, next) {
        
        let token = req.headers['token'] || req.headers['x-access-token'];

        if (!token) {
            return res.status(403).send({ auth: false, message: 'No auth token provided.' });
        } else {
            const users = db.addCollection('users');

            result = users.find();

            return res.status(200).json({message: result, status: 201});
        }
    },


    //method to create user posts
    createPosts(req, res) {

        let token = req.headers['token'] || req.headers['x-access-token'];

        if (!token) {
            return res.status(403).send({ auth: false, message: 'No auth token provided.' });
        } else {

            const posts = db.addCollection('posts', { indices: ['id'] });
            posts.ensureUniqueIndex('id');    
        
            const postData = {
                userId: req.body.userId,
                id: req.body.id,
                title: req.body.title,
                body: req.body.body,
            };

            try{
                posts.insert(postData);

                result = posts.find();

                return res.status(200).json({data: result, status: 200});   
            }catch(e){
                return res.status(500).json({message: e, status: 500});
            }
        }
        
    },

    //method to create post comment
    createComments(req, res) {

        let token = req.headers['token'] || req.headers['x-access-token'];

        if (!token) {
            return res.status(403).send({ auth: false, message: 'No auth token provided.' });
        } else {
         
            const comments = db.addCollection('comments', { indices: ['id'] });
            comments.ensureUniqueIndex('id');    
        
            const commentData = {
                postId: req.body.postId,
                id: req.body.id,
                name: req.body.name,
                email: req.body.email,
                body: req.body.body,
            };

            try{
                comments.insert(commentData);

                result = comments.find();

                return res.status(200).json({data: result, status: 200});   
            }catch(e){
                return res.status(500).json({message: e, status: 500});
            }
        }
        
    },


    //method to get user post
    getUserPost(req, res) {

        let token = req.headers['token'] || req.headers['x-access-token'];

        if (!token) {
            return res.status(403).send({ auth: false, message: 'No auth token provided.' });
        } else {

            let userId = req.params.userId;

            const posts = db.addCollection('posts', { indices: ['id'] });

            try{

                var results = posts.find({'userId': userId});

                return res.status(200).json({data: result, status: 200});   
            }catch(e){
                return res.status(500).json({message: e, status: 500});
            }
        }
        
    },


    //method to get post comment
    getPostComment(req, res) {

        let token = req.headers['token'] || req.headers['x-access-token'];

        if (!token) {
            return res.status(403).send({ auth: false, message: 'No auth token provided.' });
        } else {

            let postId = req.params.postId;

            const comments = db.addCollection('comments', { indices: ['id'] });

            try{
                
                var results = comments.find({'postId': postId});

                return res.status(200).json({data: result, status: 200});   
            }catch(e){
                return res.status(500).json({message: e, status: 500});
            }
        }
        
    },

    //deleting a post comment by id
    deleteComment(req, res) {

        let token = req.headers['token'] || req.headers['x-access-token'];

        if (!token) {
            return res.status(403).send({ auth: false, message: 'No auth token provided.' });
        } else {
            let commentId = req.params.id;

            const comments = db.addCollection('comments', { indices: ['id'] });

            try{
                
                var results =  comments.chain().find({ 'id': commentId }).remove()

                return res.status(200).json({message: 'success', status: 200});

            }catch(e){
                return res.status(500).json({message: e, status: 500});
            }
        } 
    },

    
    //updating a post by id
    updatePost(req, res) {

        let token = req.headers['token'] || req.headers['x-access-token'];

        if (!token) {
            return res.status(403).send({ auth: false, message: 'No auth token provided.' });
        } else {

            const posts = db.addCollection('posts', { indices: ['id'] });

            let doc = posts.by("id", req.body.id);

            doc.title = req.body.title;
            doc.body = req.body.body;
            doc.userId = req.body.userId;

            posts.update(doc);

            return res.status(200).json({message: 'success', status: 200});
        }
    },

    
};