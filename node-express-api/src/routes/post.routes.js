module.exports = (express, app) => {
  const controller = require("../controllers/post.controller.js");
  const router = express.Router();

  // Select all posts.
  router.get("/page/:pageNumber", controller.getPage);
  router.get("/count", controller.getPostCount);

  // Select a single post based on ID
  router.post("/post/:postId", controller.getPost);

  router.post("/addPostRating/:postId", controller.addPostRating);
  router.post("/deletePostRating/:postId", controller.deletePostRating);

  router.post("/addReplyRating/:replyId", controller.addReplyRating);
  router.post("/deleteReplyRating/:replyId", controller.deleteReplyRating);

  router.delete("/:postId", controller.deletePost);

  router.post("/reply", controller.addReply);

  router.post("/update/:postId", controller.updatePost);


  router.post("/create", controller.createPost);


  app.use("/api/posts", router);
};
