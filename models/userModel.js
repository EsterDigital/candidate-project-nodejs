const { getDatabase } = require("../config/loki");
const db = getDatabase();

const users =  db.addCollection('users', { indices: ['_id'] });

const User = {
  // schema and validation
  createUserSchema: {
    name: {
      exists: {
        errorMessage: "name field is missing"
      },
      notEmpty: {
        errorMessage: "name field cannot be empty"
      }
    },
    username: {
      exists: {
        errorMessage: "username field is missing"
      },
      notEmpty: {
        errorMessage: "username field cannot be empty"
      }
    },
    email: {
      exists: {
        errorMessage: "email field is missing"
      },
      notEmpty: {
        errorMessage: "email field cannot be empty"
      },
      isEmail: {
        errorMessage: "invalid email value",
        bail: true
      }
    },
    address: {
      exists: {
        errorMessage: "address field is missing"
      },
      isObject: {
        errorMessage: "address field should be object"
      }
    },
    'address.*.zipcode': {
      optional: { options: { nullable: true } },
      isPostalCode: {
        options: 'US', 
        errorMessage: "zipcode should be in US format"
      },
    },
    phoneNumbers: {
      exists: {
        errorMessage: "phoneNumbers field is missing"
      },
      isArray: {
        errorMessage: "phoneNumbers should be array"
      }
    },
    website: {
      exists: {
        errorMessage: "website field is missing"
      }
    }
  },
  // db operations
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