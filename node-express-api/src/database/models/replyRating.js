module.exports = (sequelize, DataTypes) =>
  sequelize.define("replyRating", {
    replyId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    // fk to user table
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    // Using boolean value for like and dislike to save space and resources.
    isLike: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    // Don't add the timestamp attributes (updatedAt, createdAt).
    timestamps: false
  });