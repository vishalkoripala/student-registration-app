const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// File upload config
const upload = multer({ dest: "uploads/" });

app.post("/submit", upload.single("profilePic"), (req, res) => {
  console.log("Form Data Received:");
  console.log(req.body);

  if (req.file) {
    console.log("Uploaded File:", req.file.originalname);
  }

  res.send("<h2>Form submitted successfully!</h2><a href='/'>Go Back</a>");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
