const { sequelize } = require("../database");
const db = require("../database");

// Select all users from the database.
exports.createPost = async (req, res) => {
  const data = {
    userId: req.body.userId,
    postTitle: req.body.postTitle,
    postBody: req.body.postBody,
    postImage: req.body.postImage
  }
  if (data.postBody.length > 600 || data.postTitle.length > 100) {
    return res.json("Too long")
  }
  else {
    await db.post.create(data)
    return res.json("Success");
  }
};

// Select one user from the database.
exports.getPost = async (req, res) => {
  const postLikeCount = await db.postRating.count({
    where: {
      postId: req.params.postId,
      isLike: true
    }
  })
  const postDislikeCount = await db.postRating.count({
    where: {
      postId: req.params.postId,
      isLike: false
    }
  })

  const postContent = await db.post.findOne({
    attributes: {
      include: [
        [sequelize.fn('date_format', sequelize.col('postDate'), '%Y-%m-%d %h:%i'), 'postDate']
      ]
    },
    include: [{
      model: db.postReply,
      attributes: ["replyBody", "replyDate", "replyId"],
      include: [{
        model: db.user,
        attributes: ["username", "userId"]
      },
      {
        model: db.replyRating,
        required: false,
        attributes: ["isLike", "userId"],
      }
      ],
      order: [['replyDate', 'DESC']]
    },

    {
      model: db.user,
      attributes: ["username", "userId"]
    },
    {
      model: db.postRating,
      attributes: ["isLike"],
      required: false,
      where: {
        postId: req.params.postId,
        userId: req.body.currentUser,
      }
    }
    ],
    where: {
      postId: req.params.postId
    }
  });

  postContent.dataValues.likeCount = postLikeCount - postDislikeCount;

  return res.json(postContent);
};


exports.deletePost = async (req, res) => {
  await db.post.destroy({
    where: {
      postId: req.params.postId
    }
  })
  return res.json("Success");
}



// Create a user in the database.
exports.updatePost = async (req, res) => {
  const postData = {
    postTitle: req.body.postTitle,
    postBody: req.body.postBody,
    postImage: req.body.postImage
  }
  await db.post.update(postData, { where: { postId: req.params.postId } })
  return res.json("Success");
};


exports.addReply = async (req, res) => {
  let replyData = {
    replyBody: req.body.replyBody,
    userId: req.body.userId,
    postId: req.body.postId
  }
  await db.postReply.create(replyData);
  return res.json("Success");
};

exports.addPostRating = async (req, res) => {
  // This checks if the opposite rating exists, removes it then adds the proper rating
  const count = await db.postRating.count({
    where: {
      postId: req.params.postId,
      userId: req.body.currentUser
    }
  })
  if (count > 0) {
    await db.postRating.update({
      postId: req.params.postId,
      userId: req.body.currentUser,
      isLike: req.body.isLike
    },
      {
        where: {
          postId: req.params.postId,
          userId: req.body.currentUser,
        }
      })
  }
  else {
    await db.postRating.create({
      postId: req.params.postId,
      userId: req.body.currentUser,
      isLike: req.body.isLike
    })
  }
  return res.json("Success");
};

exports.deletePostRating = async (req, res) => {
  await db.postRating.destroy({
    where: {
      postId: req.params.postId,
      userId: req.body.currentUser
    }
  })
  return res.json("Success");
}

exports.addReplyRating = async (req, res) => {
  // This checks if the opposite rating exists, removes it then adds the proper rating
  const count = await db.replyRating.count({
    where: {
      replyId: req.params.replyId,
      userId: req.body.currentUser
    }
  })
  if (count > 0) {
    await db.replyRating.update({
      replyId: req.params.replyId,
      userId: req.body.currentUser,
      isLike: req.body.isLike
    },
      {
        where: {
          replyId: req.params.replyId,
          userId: req.body.currentUser,
        }
      })
  }
  else {
    await db.replyRating.create({
      replyId: req.params.replyId,
      userId: req.body.currentUser,
      isLike: req.body.isLike
    })
  }
  return res.json("Success");
};

exports.deleteReplyRating = async (req, res) => {
  await db.replyRating.destroy({
    where: {
      replyId: req.params.replyId,
      userId: req.body.currentUser
    }
  })
  return res.json("Success");
}




exports.getPostCount = async (req, res) => {
  const count = await db.post.count({});
  return res.json(count);
}

// Update a user in the database.
exports.getPage = async (req, res) => {
  const offset = ((req.params.pageNumber - 1) * 10);
  const pageContent = await db.post.findAll({
    attributes: {
      exclude: ["postBody", "postImage"],
      include: [[db.sequelize.fn("COUNT", db.sequelize.col("postReplies.replyId")), "replyCount"], [sequelize.fn('date_format', sequelize.col('postDate'), '%Y-%m-%d %h:%i'), 'postDate']]
    },
    include: [{
      model: db.user,
      attributes: ["username", "userIcon"]
    }, {
      model: db.postReply,
      attributes: []
    }
    ],
    offset: offset,
    limit: 10,
    group: ["post.postId"],
    order: [['postDate', 'DESC']],
    // It seems like the offset and limit are passed into the associations, which isn't what I want, so I need
    // to use subQuery: false to keep the limit and offset only in the post scope.
    subQuery: false
  })
  return res.json(pageContent);
};