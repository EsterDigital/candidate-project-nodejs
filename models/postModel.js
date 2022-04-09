const { getDatabase } = require("../config/loki");
const db = getDatabase();

const posts =  db.addCollection('posts', { indices: ['_id'] });

const Post = {
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