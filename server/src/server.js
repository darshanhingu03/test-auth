const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { PrismaClient } = require("@prisma/client");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const generateToken = (user) => {
  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const sendVerificationEmail = async (user, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Email Verification",
    text: `Verify your email using this token: ${token}`,
  };

  await transporter.sendMail(mailOptions);
};

// Signup
app.post("/signup", async (req, res) => {
  const { email, password, twoFactorEnabled } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      twoFactorEnabled,
    },
  });

  const token = generateToken(user);

  if (twoFactorEnabled) {
    const secret = speakeasy.generateSecret();
    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorSecret: secret.base32 },
    });

    const otpAuthUrl = speakeasy.otpauthURL({
      secret: secret.ascii,
      label: `auth-app (${email})`,
      issuer: "auth-app",
    });

    QRCode.toDataURL(otpAuthUrl, (err, dataUrl) => {
      res.json({ token, twoFactorEnabled, qrCode: dataUrl });
    });
  } else {
    res.json({ token, twoFactorEnabled });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password, token } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  if (user.twoFactorEnabled) {
    if (!token) {
      return res.status(401).json({ error: "2FA token required" });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token,
    });

    if (!verified) {
      return res.status(401).json({ error: "Invalid 2FA token" });
    }
  }

  const jwtToken = generateToken(user);

  res.json({ token: jwtToken });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
