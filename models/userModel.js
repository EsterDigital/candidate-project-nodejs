const { getDatabase } = require("../config/loki");
const db = getDatabase();

const users =  db.addCollection('users', { indices: ['_id'] });

const User = {
  getUsers(query){
    query = query || { };
    return users.find(query);
  },
  findUser(id){
    const existingUser = users.get(id);
    if(!existingUser)
      return;
    return existingUser;
  },
  isPresent(email){
    const foundUser = users.findOne({ email:email });
    return foundUser ? true : false;
  },
  create(userObj){
    return users.insert(userObj);
  },
  update(id, userObj){
    let existingUser = users.get(id);
    if (!existingUser)
      return;

    for (let property in userObj){
      // id is an artificial property added on returned userObj only, so do not persist it
      if (property === id)
        continue;

      existingUser[property] = userObj[property];
    }
    return users.update(existingUser);
  },
  delete(id){ 
    let existingUser = users.get(id);
    if (!existingUser)
      return;
    
    return users
      .chain()
      .find({ $loki: id })
      .remove();
  }
};

module.exports = User;