const file = require("../models/file");
const File = require("../models/file");
const cloudiary = require("cloudinary");

const isFileTypeSupported = (type, supportedTypes) => {
  return supportedTypes.includes(type);
};

const uploadFileToCloudinary = async (file, folder, quality) => {
  const option = { folder };
  option.resource_type = "auto";
  //for reduce the quality
  if (quality) option.quality = quality;

  return await cloudiary.v2.uploader.upload(file.tempFilePath, option);
};

exports.localFileUpload = async (req, res) => {
  try {
    //fetch file
    const { file } = req.files;

    let path =
      __dirname + "/files/" + Date.now() + `.${file.mimetype.split("/")[1]}`;
    file.mv(path);
    res.json({
      success: true,
      message: "local file uploaded successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "local upload failed",
      error: error.message,
    });
  }
};

//image upload handler
exports.imageUpload = async (req, res) => {
  try {
    const { name, tags, email } = req.body;
    const file = req.files.imageFile;
    // validation
    const supportedTypes = ["jpeg", "jpg", "png"];
    const fileType = file.mimetype.split("/")[1].toLowerCase();
    const imageSize = file.size;
    const LimitSize = 2 * 1024 * 1024; //2mb
    if (imageSize > LimitSize) {
      return res.status(400).json({
        success: false,
        message: "image size is too large",
      });
    }

    if (!isFileTypeSupported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: "imageType type not supported",
      });
    }
    //file type supported
    const result = await uploadFileToCloudinary(file, "images", 50);
    //save entry in db
    const response = await File.create({
      name,
      tags,
      email,
      imageUrl: result.secure_url,
    });

    res.json({
      success: true,
      Response: response,
      imageUrl: result.secure_url,
      message: "image uploaded successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "image upload failed",
      error: error.message,
    });
  }
};

//videoUpload Handler
exports.videoUpload = async (req, res) => {
  try {
    const { name, tags, email } = req.body;
    const file = req.files.videoFile;
    //validation
    const supportedTypes = ["mp4", "mov"];
    const fileType = file.mimetype.split("/")[1].toLowerCase();
    const videoSize = file.size;
    const LimitSize = 100 * 1024 * 1024; //100mb
    if (videoSize > LimitSize) {
      return res.status(400).json({
        success: false,
        message: "video size is too large",
      });
    }
    if (!isFileTypeSupported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: "videoFileType type not supported",
      });
    }

    const result = await uploadFileToCloudinary(file, "videos");
    const response = await File.create({
      name,
      tags,
      email,
      imageUrl: result.secure_url,
    });
    res.json({
      success: true,
      response: response,
      videoUrl: result.secure_url,
      message: "video uploaded successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "video upload failed",
      error: error.message,
    });
  }
};
