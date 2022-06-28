const { Sequelize, DataTypes } = require("sequelize");
const config = require("./config.js");

const db = {
  Op: Sequelize.Op
};

// Create Sequelize.
db.sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.DIALECT,
  timezone: '+10:00'
});

// Include models.
db.user = require("./models/user.js")(db.sequelize, DataTypes);
db.post = require("./models/post.js")(db.sequelize, DataTypes);
db.postReply = require("./models/postReply.js")(db.sequelize, DataTypes);
db.following = require("./models/following.js")(db.sequelize, DataTypes);
db.postRating = require("./models/postRating.js")(db.sequelize, DataTypes);


db.user.hasMany(db.post, {
  foreignKey: "userId",
  targetKey: "userId",
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
db.post.belongsTo(db.user, {
  foreignKey: "userId",
  targetKey: "userId",
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
db.user.hasMany(db.postReply, {
  foreignKey: "userId",
  targetKey: "userId",
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
db.user.hasMany(db.following, {
  foreignKey: "follower",
  targetKey: "follower",
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
db.user.hasMany(db.following, {
  foreignKey: "isFollowing",
  targetKey: "isFollowing",
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
db.following.belongsTo(db.user, {
  foreignKey: "follower",
  targetKey: "userId",
});
db.following.belongsTo(db.user, {
  foreignKey: "isFollowing",
  targetKey: "userId",
});
db.postReply.belongsTo(db.user, {
  foreignKey: "userId",
  targetKey: "userId",
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
db.post.hasMany(db.postReply, {
  foreignKey: "postId",
  targetKey: "postId",
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
db.post.hasMany(db.postRating, {
  foreignKey: "postId",
  targetKey: "postId",
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
db.postRating.belongsTo(db.post, {
  foreignKey: "postId",
  targetKey: "postId",
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});


// Include a sync option with seed data logic included.
db.sync = async () => {
  // If database schema doesn't exist, then create it 
  await db.sequelize.sync();
  // await db.sequelize.sync({alter: true});

  // await seedData();
};

// async function seedData() {
//   // const count = await db.user.count();

//   // // Only seed data if necessary.
//   // if(count > 0)
//   //   return;

//   await db.user.create({email: "test", username: 't', firstName: 't', lastName: 't', passwordHash: 't', userIcon: 't' });
//   await db.user.create({email: "tesdwt", username: 'tw', firstName: 't', lastName: 't', passwordHash: 't', userIcon: 't' });
// }

module.exports = db;
