import "dotenv/config";
import EnvConfig from "./env.interface";

const loadEnvs = (): EnvConfig => {
  // Check missing envs
  const requiredEnvs: string[] = [
    "DB_URL",
    "PORT",
    "NODE_ENV",

    "JWT_ACCESS_SECRET",
    "JWT_ACCESS_EXPIRESIN",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRESIN",

    "BCRYPT_SALT_ROUNDS",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD",

    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",

    "EXPRESS_SESSION_SECRET",
    "FRONTEND_URL",

    "SSL_STORE_ID",
    "SSL_STORE_PASSWORD",
    "SSL_PAYMENT_API",
    "SSL_VALIDATION_API",
    "SSL_IPN_URL",

    "SSL_SUCCESS_BACKEND_URL",
    "SSL_FAILED_BACKEND_URL",
    "SSL_CANCELED_BACKEND_URL",

    "SSL_SUCCESS_FRONTEND_URL",
    "SSL_FAILED_FRONTEND_URL",
    "SSL_CANCELED_FRONTEND_URL",

    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",

    "SMTP_PORT",
    "SMTP_HOST",
    "SMTP_PASS",
    "SMTP_USER",
    "SMTP_FROM",

    "RADIS_USERNAME",
    "RADIS_PASSWORD",
    "RADIS_HOST",
    "RADIS_PORT",
  ];
  requiredEnvs.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing the required enviroment variable : ${key}`);
    }
  });

  // Return validated envs
  return {
    DB_URL: process.env.DB_URL as string,
    PORT: process.env.PORT as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",

    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_ACCESS_EXPIRESIN: process.env.JWT_ACCESS_EXPIRESIN as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRESIN: process.env.JWT_REFRESH_EXPIRESIN as string,

    BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS as string,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,

    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,

    SSL: {
      STORE_ID: process.env.SSL_STORE_ID as string,
      STORE_PASSWORD: process.env.SSL_STORE_PASSWORD as string,
      PAYMENT_API: process.env.SSL_PAYMENT_API as string,
      VALIDATION_API: process.env.SSL_VALIDATION_API as string,
      IPN_URL: process.env.SSL_IPN_URL as string,

      SUCCESS_BACKEND_URL: process.env.SSL_SUCCESS_BACKEND_URL as string,
      FAILED_BACKEND_URL: process.env.SSL_FAILED_BACKEND_URL as string,
      CANCELED_BACKEND_URL: process.env.SSL_CANCELED_BACKEND_URL as string,

      SUCCESS_FRONTEND_URL: process.env.SSL_SUCCESS_FRONTEND_URL as string,
      FAILED_FRONTEND_URL: process.env.SSL_FAILED_FRONTEND_URL as string,
      CANCELED_FRONTEND_URL: process.env.SSL_CANCELED_FRONTEND_URL as string,
    },

    CLOUDINARY: {
      CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
      API_KEY: process.env.CLOUDINARY_API_KEY as string,
      API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
    },

    EMAIL_SENDER: {
      SMTP_PORT: process.env.SMTP_PORT as string,
      SMTP_HOST: process.env.SMTP_HOST as string,
      SMTP_PASS: process.env.SMTP_PASS as string,
      SMTP_USER: process.env.SMTP_USER as string,
      SMTP_FROM: process.env.SMTP_FROM as string,
    },

    RADIS: {
      HOST: process.env.RADIS_HOST as string,
      PORT: process.env.RADIS_PORT as string,
      USERNAME: process.env.RADIS_USERNAME as string,
      PASSWORD: process.env.RADIS_PASSWORD as string,
    },
  };
};

const envVars = loadEnvs();
export default envVars;
