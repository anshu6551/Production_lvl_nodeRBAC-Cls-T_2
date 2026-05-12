const express = require("express");

const router = express.Router();

const UserController = require("../controller/userController");

const UserAuthCheck = require("../middleware/AdminAuthCheck");
const RoleAuthCheck = require("../middleware/roleAuthCheck");

const UserImage = require("../utils/cloudinary");

router.post("/login", UserController.login);

router.get("/", UserAuthCheck, RoleAuthCheck("admin"), UserController.getUsers);
router.get(
  "/:id",
  UserAuthCheck,
  RoleAuthCheck("admin"),
  UserController.getUserById,
);
router.post(
  "/",
  UserAuthCheck,
  RoleAuthCheck("admin"),
  UserImage.single("avatar"),
  UserController.createUser,
);
router.put(
  "/:id",
  UserAuthCheck,
  RoleAuthCheck("admin"),
  UserImage.single("avatar"),
  UserController.updateUser,
);
router.delete(
  "/:id",
  UserAuthCheck,
  RoleAuthCheck("admin"),
  UserController.deleteUser,
);
router.patch(
  "/status/:id",
  UserAuthCheck,
  RoleAuthCheck("admin"),
  UserController.updateStatusUser,
);

module.exports = router;
