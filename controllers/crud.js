const { getDatabase } = require("../config/loki");

var validator = require("email-validator");

exports.createUser = (req,res,next) => {

    const db = getDatabase();
    const users = db.getCollection('users');
    const user = req.body;

    try {


        if (!validator.validate(user.email)){
            return res.status(403).json({ error: 'Please provide a valid email'})
        }
        if (!user.id){
            return res.status(403).json({ error: 'Please provide an id'})
        }
        if(!user.name){
            return res.status(403).json({ error: 'Please provide a name'})
        }
        if(!user.username){
            return res.status(403).json({ error: 'Please provide a username'})
        }
        if(users.find({"postId": { '$eq' : user.email}})){
            return res.status(403).json({ error: 'User already registered'})
        }

        users.insert({

            id : user.id,
            name : user.name,
            username : user.username,
            email : user.email,
            address: {
                street: user.street,
                city: user.city,
                zipcode: user.zipcode,
                geo: {
                    lat: user.lat,
                    lng: user.lng
                }               
            },
            phoneNumbers: [user.phoneNumbers],
            website: user.website
        })

    }catch (error){

        res.send(error);
    }

    res.sendStatus(200);
}


exports.getComments = (req,res,next) => {

    const db = getDatabase();
    const comment = db.getCollection("comments");
    const postId = req.query.postId;

    try{

        results = comment.find({"postId": { '$eq' : Number(postId)}});

    }catch (error){

        res.send(error);
    }

    res.sendStatus(200);
}

exports.updatePost = (req,res) => {

    const db = getDatabase();
    const id = req.query.postId;
    const body = req.body.message;
    const posts = db.getCollection("posts");

    try{

        var result = posts.find({"id": { '$eq' : Number(id) }})
        result[0].body = body;
        posts.update(result);


    }catch (error){

        res.send(error);
    }
    
    res.sendStatus(200);

}    

exports.deleteComment = (req,res) => {

    const db = getDatabase();
    const comments = db.getCollection("comments");
    const commentId = req.query.commentId;

    try{
        comments.findAndRemove({
            "id" : Number(commentId)
           });

    }catch (error) {

        res.sendStatus(error);
    }

    res.sendStatus(200);
}