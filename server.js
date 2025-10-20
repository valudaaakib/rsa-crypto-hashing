const express = require("express");
const crypto = require("crypto");

const app = express();
app.use(express.json());

// 16-character secret key (same as Flutter)
const secretKey = "1234567890123456"; // 16 chars = 128-bit key
const iv = Buffer.from(secretKey, "utf8"); // using same as IV (for demo only)

// Encrypt function (AES-128-CBC, PKCS7 padding)
function encryptText(text) {
  const cipher = crypto.createCipheriv("aes-128-cbc", Buffer.from(secretKey, "utf8"), iv);
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
}

// Decrypt function
function decryptText(encryptedBase64) {
  const decipher = crypto.createDecipheriv("aes-128-cbc", Buffer.from(secretKey, "utf8"), iv);
  let decrypted = decipher.update(encryptedBase64, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// API to test
app.post("/encrypt", (req, res) => {
  const { text } = req.body;
  const encrypted = encryptText(text);
  res.json({ encrypted });
});

app.post("/decrypt", (req, res) => {
  const { encrypted } = req.body;
  const decrypted = decryptText(encrypted);
  res.json({ decrypted });
});

app.listen(3000, () => console.log("Server running on port 3000"));
