const { getDatabase } = require("../config/loki");
const db = getDatabase();

const posts =  db.addCollection('posts', { indices: ['_id'] });

const Post = {
  // schema and validation
  createPostSchema: {
    userId: {
      exists: {
        errorMessage: "userId field is missing"
      },
      notEmpty: {
        errorMessage: "userId field cannot be empty"
      },
      isInt: {
        errorMessage: "invalid userId, it should be number"
      }
    },
    title: {
      exists: {
        errorMessage: "title field is missing"
      },
      notEmpty: {
        errorMessage: "title field cannot be empty"
      }
    },
    body: {
      exists: {
        errorMessage: "body field is missing"
      }
    }
  },
  getPostsByUserIdSchema: {
    userId: {
      in: ['params', 'query'],
      errorMessage: "provide userId as number to fetch details",
      isInt: true,
      toInt: true,
    }
  },
  // db operations
  getPosts(query){
    query = query || { };
    return posts.find(query);
  },
  findPost(id){
    const existingPost = posts.get(id);
    if(!existingPost)
      return;
    return existingPost;
  },
  create(postObj){
    return posts.insert(postObj);
  },
  update(id, postObj){
    let existingPost = posts.get(id);
    if (!existingPost)
      return;

    for (let property in postObj){
      // id is an artificial property added on returned postObj only, so do not persist it
      if (property === id)
        continue;

      existingPost[property] = postObj[property];
    }
    return posts.update(existingPost);
  },
  delete(id){ 
    let existingPost = posts.get(id);
    if (!existingPost)
      return;
    
    return posts
      .chain()
      .find({ $loki: id })
      .remove();
  }
};

module.exports = Post;