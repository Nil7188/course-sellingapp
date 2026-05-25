import dotenv from "dotenv";
dotenv.config();
 


  const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD;
  const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD;
  const STRIPE_SECRET_KEY = "sk_test_51TMiauGeiyEOrQeOD5KRwdwTYkaVdJzApbQC2rzZk0aR4YN7xST8SFAyJZpV1j1kq2OAi3zCEmdODRh8ftNAyr7e00qxNYeoaO";


export default {
  JWT_USER_PASSWORD,
  JWT_ADMIN_PASSWORD,
  STRIPE_SECRET_KEY,
};
