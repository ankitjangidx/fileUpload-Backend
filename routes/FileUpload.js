const router = require("express").Router();
const {
  imageUpload,
  videoUpload,
  imageReducer,
  localFileUpload,
} = require("../controllers/fileUpload");

router.post("/localFileUpload", localFileUpload);
router.post("/imageUpload", imageUpload);
router.post("/videoUpload", videoUpload);
module.exports = router;
