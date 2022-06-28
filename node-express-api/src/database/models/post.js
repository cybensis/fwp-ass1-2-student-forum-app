module.exports = (sequelize, DataTypes) =>
  sequelize.define("post", {
    postId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    postTitle: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    postBody: {
      type: DataTypes.STRING(600),
      allowNull: true
    },
    postImage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    postDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    // Don't add the timestamp attributes (updatedAt, createdAt).
    timestamps: false
  });
