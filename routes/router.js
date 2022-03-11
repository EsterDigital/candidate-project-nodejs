const express = require("express");
const router = express.Router();

const {
    createUser,
    getComments,
    updatePost,
    deleteComment
} = require("../controllers/crud")

router.route("/user").post(createUser);
router.route("/comments/list").get(getComments);
router.route("/posts/updatePost").patch(updatePost);
router.route("/comments/deleteComment").delete(deleteComment);

module.exports = router ;