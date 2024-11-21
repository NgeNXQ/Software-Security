const axios = require("axios");
const jwt = require("jsonwebtoken");

const secret = "ZRF8Op0tWM36p1_hxXTU-B0K_Gq_-eAVtlrQpY24CasYiDmcXBhNS6IJMNcz1EgB";

// Функція для перевірки токена
function verifyToken(token) {
  jwt.verify(token, secret, { algorithms: ["HS256"] }, (err, decoded) => {
    if (err) {
      console.log("Токен недійсний:", err.message);
    } else {
      console.log("Токен дійсний:", decoded);
    }
  });
}

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlVzZXJuYW1lIiwiaWF0IjoxNzI5MTUwNjAyLCJleHAiOjE3MjkxNTQyMDJ9.u6tsuyLFc_Bs1Z36GzW1dhMUSuquPKRixZkfaIWVE78";

verifyToken(token);
