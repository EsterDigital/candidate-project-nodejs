// Retrieve database connection
let db = require('../config/loki.js').getDatabase(),
    users,
    posts,
 comments;

// Retrieve collections from the catalog (asynchronous loading/saving)
db.loadDatabase({}, () => {
    users = db.getCollection('users');
    posts = db.getCollection('posts');
 comments = db.getCollection('comments');
});

// Expose the model
module.exports = {
    /*
    CCC 1/7: Create a user (w/o dynamic geolocation support [by TLS > https] b/c of out of challenge's scope)
        POST /users {
            "id": 501,
            "name": "John Doe",
            "username": "HAL",
            "email": "john.doe@altavista.com",
            "address": {
                "street": "Elm",
                "city": "Beverly Hills",
                "zipcode": "90210-0000",
                "geo": {
                    "lat": "1.6180",
                    "lng": "1.6180"
                }
            },
            "phoneNumbers": ["1-000-000-0042"],
            "website": "ester.co"
        } 
    */
    create_user: (jso) => {
        users.insert(jso);
    },
    /* 
    CCC 2/7: Retrieve all comments associated with a user's post
        GET /posts/1/comments
    */
    read_comments: (pid) => {
        return comments.find({postId: pid});
    },
    /* 
    CCC 3/7: Update a post [w/ PUT vs ~preferred PATCH b/c of specific mention to CRUB]
        PUT /users {
            "userId": 1,
            "id": 1,
            "title": "this title should not be updated",
            "body": "the answer to the meaning of life, the universe, and everything"
        }
    */
    update_post: (jso) => {
        posts.findAndUpdate({id: jso.id}, (post) => {
            post.title = jso.title; 
            post.body = jso.body;
        });
    },
    /*
    CCC 4/7: Delete a comment
        DELETE /users/501
    */
    delete_comment: (cid) => {
        if (comments.find({id: cid}).length) {
            comments.findAndRemove({id: cid});
            return 1;
        } else {
            return 0;
        }
    }
}