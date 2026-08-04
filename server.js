const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;

const uploadDir = path.join(__dirname, "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));
app.use("/uploads", express.static(uploadDir));

const upload = multer({ dest: uploadDir });
const fsPromises = fs.promises;
let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  nodemailer = null;
}
const bcrypt = require('bcryptjs');

function escapeHtml(value) {
  if (!value) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function validateForm(data) {
  const errors = [];
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!data.fullname || data.fullname.trim().length < 3) {
    errors.push("Full Name must be at least 3 characters.");
  }

  if (!data.email || !emailPattern.test(data.email)) {
    errors.push("Email must be valid.");
  }

  if (!data.password || data.password.length < 6) {
    errors.push("Password must be at least 6 characters.");
  }

  const age = Number(data.age);
  if (!data.age || Number.isNaN(age) || age < 10 || age > 100) {
    errors.push("Age must be between 10 and 100.");
  }

  if (!data.gender) {
    errors.push("Gender is required.");
  }

  if (!data.dob) {
    errors.push("Date of Birth is required.");
  }

  if (!data.department) {
    errors.push("Department is required.");
  }

  if (!data.phone || !/^[0-9]{10}$/.test(data.phone)) {
    errors.push("Phone must be a valid 10-digit number.");
  }

  return errors;
}

app.post("/submit", upload.single("profilePic"), async (req, res) => {
  const errors = validateForm(req.body);
  if (errors.length > 0) {
    const errorList = errors.map((error) => `<li>${escapeHtml(error)}</li>`).join("");
    return res.status(400).send(`
      <div style="font-family: Arial, sans-serif; max-width: 720px; margin: 40px auto; padding: 24px; background: #fff6f6; border: 1px solid #f2c2c2; border-radius: 10px;">
        <h2 style="color: #d32f2f;">Validation Failed</h2>
        <ul>${errorList}</ul>
        <a href="/" style="color: #007bff;">Go Back</a>
      </div>
    `);
  }

  console.log("Form Data Received:");
  console.log(req.body);

  if (req.file) {
    console.log("Uploaded File:", req.file.originalname);
  }

  const hobbies = Array.isArray(req.body.hobbies)
    ? req.body.hobbies
    : req.body.hobbies
    ? [req.body.hobbies]
    : [];
  // Hash password before saving
  let hashedPassword = null;
  try {
    if (req.body.password) {
      hashedPassword = await bcrypt.hash(req.body.password, 10);
    }
  } catch (e) {
    console.error('Password hashing failed', e);
  }

  const submission = {
    id: Date.now(),
    fullname: req.body.fullname || '',
    email: req.body.email || '',
    age: req.body.age || '',
    gender: req.body.gender || '',
    dob: req.body.dob || '',
    phone: req.body.phone || '',
    department: req.body.department || '',
    address: req.body.address || '',
    hobbies: hobbies,
    passwordHash: hashedPassword,
    profilePic: req.file ? req.file.filename : null,
    createdAt: new Date().toISOString()
  };

  async function saveSubmission(obj) {
    const file = path.join(__dirname, 'submissions.json');
    try {
      let list = [];
      try {
        const raw = await fsPromises.readFile(file, 'utf8');
        list = JSON.parse(raw || '[]');
      } catch (e) {
        list = [];
      }
      list.push(obj);
      await fsPromises.writeFile(file, JSON.stringify(list, null, 2), 'utf8');
    } catch (err) {
      console.error('Failed to save submission:', err);
    }
  }

  async function sendConfirmationEmail(to, name) {
    if (!nodemailer) return;
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.FROM_EMAIL || user;
    if (!host || !port || !user || !pass) return;
    try {
      const transporter = nodemailer.createTransport({
        host,
        port: Number(port),
        secure: Number(port) === 465,
        auth: { user, pass }
      });
      await transporter.sendMail({
        from,
        to,
        subject: 'Registration Confirmation',
        html: `<p>Hi ${escapeHtml(name)},</p><p>Thanks for registering.</p>`
      });
      console.log('Confirmation email sent to', to);
    } catch (err) {
      console.error('Failed to send email:', err);
    }
  }

  await saveSubmission(submission);
  sendConfirmationEmail(submission.email, submission.fullname);

  const profilePicHtml = req.file
    ? `
      <p><strong>Uploaded File:</strong> ${escapeHtml(req.file.originalname)}</p>
      <img src="/uploads/${escapeHtml(req.file.filename)}" alt="Profile Picture" style="max-width: 220px; border-radius: 8px; display:block; margin-top:12px;" />
    `
    : "<p>No profile picture uploaded.</p>";

  res.send(`
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 40px auto; padding: 24px; background: #f4f7f8; border-radius: 12px; box-shadow: 0 2px 14px rgba(0,0,0,0.08);">
      <h2>Registration Successful</h2>
      <p>Thanks for registering, <strong>${escapeHtml(req.body.fullname)}</strong>.</p>
      <dl style="column-count: 1; margin: 0;">
        <dt><strong>Email:</strong></dt><dd>${escapeHtml(req.body.email)}</dd>
        <dt><strong>Age:</strong></dt><dd>${escapeHtml(req.body.age)}</dd>
        <dt><strong>Gender:</strong></dt><dd>${escapeHtml(req.body.gender)}</dd>
        <dt><strong>Date of Birth:</strong></dt><dd>${escapeHtml(req.body.dob)}</dd>
        <dt><strong>Phone:</strong></dt><dd>${escapeHtml(req.body.phone)}</dd>
        <dt><strong>Department:</strong></dt><dd>${escapeHtml(req.body.department)}</dd>
        <dt><strong>Address:</strong></dt><dd>${escapeHtml(req.body.address || "N/A")}</dd>
        <dt><strong>Hobbies:</strong></dt><dd>${escapeHtml(hobbies.join(", ") || "None")}</dd>
      </dl>
      ${profilePicHtml}
      <a href="/" style="display: inline-block; margin-top: 18px; color: #007bff;">Return to form</a>
    </div>
  `);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Simple admin protection: require ADMIN_USER and ADMIN_PASS env vars to enable basic auth
function adminAuth(req, res, next) {
  const adminUser = process.env.ADMIN_USER;
  const adminPass = process.env.ADMIN_PASS;
  if (!adminUser || !adminPass) return next(); // no auth configured

  const auth = req.headers.authorization;
  if (!auth) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin"');
    return res.status(401).send('Authentication required');
  }
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Basic') return res.status(400).send('Bad auth');
  const buff = Buffer.from(parts[1], 'base64');
  const [user, pass] = buff.toString().split(':');
  if (user === adminUser && pass === adminPass) return next();
  res.setHeader('WWW-Authenticate', 'Basic realm="Admin"');
  return res.status(403).send('Forbidden');
}

app.get('/admin', adminAuth, async (req, res) => {
  const file = path.join(__dirname, 'submissions.json');
  try {
    const raw = await fsPromises.readFile(file, 'utf8');
    const list = JSON.parse(raw || '[]');
    const rows = list.map(s => `
      <tr>
        <td>${escapeHtml(String(s.id))}</td>
        <td>${escapeHtml(s.fullname || '')}</td>
        <td>${escapeHtml(s.email || '')}</td>
        <td>${escapeHtml(String(s.age || ''))}</td>
        <td>${escapeHtml(s.gender || '')}</td>
        <td>${escapeHtml(s.department || '')}</td>
        <td>${escapeHtml((s.hobbies || []).join(', '))}</td>
        <td>${s.profilePic ? `<a href="/uploads/${escapeHtml(s.profilePic)}" target="_blank">view</a>` : '—'}</td>
        <td>${escapeHtml(s.createdAt || '')}</td>
      </tr>
    `).join('');

    res.send(`
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 1000px; margin: 20px auto;">
        <h2>Submissions</h2>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width:100%;">
          <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Age</th><th>Gender</th><th>Department</th><th>Hobbies</th><th>Picture</th><th>Created</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <p style="margin-top:12px; font-size:12px; color:#666;">Password hashes are stored but not displayed.</p>
      </div>
    `);
  } catch (e) {
    return res.status(500).send('Failed to read submissions');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
