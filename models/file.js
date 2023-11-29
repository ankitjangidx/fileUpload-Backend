const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
require("dotenv").config();

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  tags: {
    type: String,
  },
  email: {
    type: String,
  },
});
//post middleware
fileSchema.post("save", async (doc) => {
  try {
    //transpoter
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    //send mail
    const mailOptions = {
      from: "xxxxxxxxxxxxxxxxxxxxx",
      to: doc.email,
      subject: "File uploaded to cloudinary",
      text: `File uploaded to cloudinary successfully`,
      html: `<p>File uploaded successfully 😉 <br><a href="${doc.imageUrl}"> <img src="${doc.imageUrl}"/><a/></p>`,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    console.log("info", info);
  } catch (error) {
    console.log(error);
  }
});
module.exports = mongoose.model("File", fileSchema);
