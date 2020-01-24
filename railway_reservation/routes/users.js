var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

Router.get("/:id/", userController.user_detail);

Router.get("/create/", userController.user_create_get);
Router.post("/create/", userController.user_create_post);

Router.get("/:id/update/", userController.user_update_get);
Router.post("/:id/update/", userController.user_update_post);

module.exports = router;
