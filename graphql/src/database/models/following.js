module.exports = (sequelize, DataTypes) =>
  sequelize.define("following", {
    follower: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    // fk to user table
    isFollowing: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    }
  }, {
    // Don't add the timestamp attributes (updatedAt, createdAt).
    timestamps: false
  });
