module.exports = (sequelize, DataTypes) =>
  sequelize.define("postReply", {
    replyId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    replyBody: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    replyDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    // Don't add the timestamp attributes (updatedAt, createdAt).
    timestamps: false
  });
