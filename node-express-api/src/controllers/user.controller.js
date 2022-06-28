const argon2 = require('argon2');
const { sequelize } = require("../database");

const db = require("../database");

/**
 * Used to check user supplied email and password for succesful login, and returns user details if correct.
 * 
 * @param {{email,password}} req - Request data
 * @param {*} res - Response data
 * @returns {Promise<res>} - Responds with the details of the logged in user, or returns empty for failed login.
 */
exports.login = async (req, res) => {
  const checkEmail = await db.user.findOne({
    attributes: ["userId", "passwordHash"],
    where: {
      email: req.body.email
    }
  })

  if (checkEmail && await argon2.verify(checkEmail.dataValues.passwordHash, req.body.password)) {
    const response = await db.user.findOne({
      attributes: {
        exclude: ["passwordHash"]
      },
      where: {
        userId: checkEmail.dataValues.userId
      }
    })
    return res.json(response);
  }
  else {
    return res.json("")
  }
};

exports.getFollowings = async (req, res) => {
  const followings = await db.following.findAll({
    include: [{
      model: db.user,
      required: false,
      attributes: ["username", "userIcon"],
    }],
    attributes: ["isFollowing"],
    where: {
      follower: req.params.userId
    }
  })
  return res.json(followings);
}

// Select all users from the database.
exports.followUser = async (req, res) => {
  const follow = await db.following.create({
    follower: req.body.currentUser,
    isFollowing: req.params.userId
  });
  return res.json(follow);
};
// Select all users from the database.
exports.unfollowUser = async (req, res) => {
  const unfollow = await db.following.destroy({
    where: {
      follower: req.body.currentUser,
      isFollowing: req.params.userId
    }
  })
  return res.json(unfollow);
};


// Select one user from the database, with followers based off current users userId, which is why its POST
exports.getUser = async (req, res) => {
  const userId = req.params.userId;
  const userData = await db.user.findOne({

    attributes: {
      exclude: ["passwordHash", "email", "isBlocked", "isAdmin"],
    },
    include: [{
      model: db.following,
      required: false,
      attributes: ["follower"],
      where: {
        follower: req.body.currentUser,
        isFollowing: req.params.userId
      }
    }],
    where: { userId: userId }
  })
  return (userData === null) ? res.json("") : res.json(userData);
};

// Create a user in the database.
exports.create = async (req, res) => {
  const passwordHash = await argon2.hash(req.body.password)
  const existingEmail = await db.user.count({ where: { email: req.body.email } })
  const existingUsername = await db.user.count({ where: { username: req.body.username } })
  if (existingEmail || existingUsername) {
    const response = "This " + ((existingEmail == 1) ? "email" : "username") + " is already in use."
    return res.json(response);
  }
  else {
    const user = await db.user.create({
      attributes: {
        include: [
          [sequelize.fn('date_format', sequelize.col('postDate'), '%Y-%m-%d %h:%i'), 'postDate']
        ]
      },
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      passwordHash: passwordHash,
    });
    return res.json(user);
  }
};

// Update a user in the database.
exports.update = async (req, res) => {
  const originalData = req.body.originalData;
  const newData = {
    email: req.body.newData.email,
    firstName: req.body.newData.firstName,
    lastName: req.body.newData.lastName,
    username: req.body.newData.username,
    passwordHash: req.body.newData.password,
    userIcon: req.body.newData.userIcon
  }
  if (newData.passwordHash === "") delete newData.passwordHash
  else newData.passwordHash = await argon2.hash(newData.passwordHash);

  const existingEmail = await ((originalData.email === newData.email) ? 0 : db.user.count({ where: { email: newData.email } }));
  const existingUsername = await ((originalData.username === newData.username) ? 0 : db.user.count({ where: { username: newData.username } }));

  if (existingEmail || existingUsername) {
    const response = "This " + ((existingEmail == 1) ? "email" : "username") + " is already in use."
    return res.json(response);
  }
  else {
    const update = await db.user.update(newData, { where: { userId: req.params.id } })
    return res.json("Success");
  }

};

// Remove a user from the database.
exports.remove = async (req, res) => {
  const id = req.params.id;
  let removed = false;
  await db.user.destroy({
    where: {
      userId: req.params.userId
    }
  });
  await db.following.destroy({
    where: {
      [db.Op.or]: { follower: req.params.userId, isFollowing: req.params.userId }
    }
  })
  return res.json("Success");
};
