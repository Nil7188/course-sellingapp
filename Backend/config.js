import dotenv from "dotenv";
dotenv.config();

const config = {
  JWT_USER_PASSWORD: process.env.JWT_USER_PASSWORD,
};

export default config;
