module.exports = (express, app) => {
  const controller = require("../controllers/user.controller.js");
  const router = express.Router();

  // Select a single user based on username
  router.post("/login", controller.login);
  router.post("/user/:userId", controller.getUser);

  router.get("/following/:userId", controller.getFollowings);
  router.post("/follow/:userId", controller.followUser);
  router.post("/unfollow/:userId", controller.unfollowUser);

  // Create a new user.
  router.post("/", controller.create);

  // Update a user with id.
  router.put("/:id", controller.update);

  // Delete a user with id.
  router.delete("/:userId", controller.remove);

  // Add routes to server.
  app.use("/api/users", router);
};
