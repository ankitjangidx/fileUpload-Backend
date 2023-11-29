const express = require("express");
require("dotenv").config();

const app = express();

const Db = require("./config/database");
Db();
const { cloudinaryConnect } = require("./config/cloudinary");
cloudinaryConnect();
const PORT = process.env.PORT || 3000;

const fileUpload = require("express-fileupload");
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use(express.json());

const Upload = require("./routes/FileUpload");
app.use("/api/v1/upload", Upload);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
