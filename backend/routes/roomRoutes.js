const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const upload = require("../middleware/upload");

const {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
} = require("../controllers/roomController");

router.get("/", getRooms);

router.get(
  "/:id",
  getRoomById
);

router.post(
  "/",
  auth,
  authorize("admin"),
  upload.single("image"),
  createRoom
);

router.put(
  "/:id",
  auth,
  authorize("admin"),
  upload.single("image"),
  updateRoom
);

router.delete(
  "/:id",
  auth,
  authorize("admin"),
  deleteRoom
);

module.exports = router;