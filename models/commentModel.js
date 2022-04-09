const { getDatabase } = require("../config/loki");
const db = getDatabase();

const comments =  db.addCollection('comments', { indices: ['_id'] });

const Comment = {
  getComments(query){
    query = query || { };
    return comments.find(query);
  },
  findComment(id){
    const existingComment = comments.get(id);
    if(!existingComment)
      return;
    return existingComment;
  },
  create(commentObj){
    return comments.insert(commentObj);
  },
  update(id, commentObj){
    let existingComment = comments.get(id);
    if (!existingComment)
      return;

    for (let property in commentObj){
      // id is an artificial property added on returned commentObj only, so do not persist it
      if (property === id)
        continue;

      existingComment[property] = commentObj[property];
    }
    return comments.update(existingComment);
  },
  delete(id){ 
    let existingComment = comments.get(id);
    if (!existingComment)
      return;
    
    return comments
      .chain()
      .find({ $loki: id })
      .remove();
  }
};

module.exports = Comment;