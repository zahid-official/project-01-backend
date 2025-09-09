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

    "SSL_SUCCESS_BACKEND_URL",
    "SSL_FAIL_BACKEND_URL",
    "SSL_CANCEL_BACKEND_URL",

    "SSL_SUCCESS_FRONTEND_URL",
    "SSL_FAIL_FRONTEND_URL",
    "SSL_CANCEL_FRONTEND_URL",
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

      SUCCESS_BACKEND_URL: process.env.SSL_SUCCESS_BACKEND_URL as string,
      FAIL_BACKEND_URL: process.env.SSL_FAIL_BACKEND_URL as string,
      CANCEL_BACKEND_URL: process.env.SSL_CANCEL_BACKEND_URL as string,

      SUCCESS_FRONTEND_URL: process.env.SSL_SUCCESS_FRONTEND_URL as string,
      FAIL_FRONTEND_URL: process.env.SSL_FAIL_FRONTEND_URL as string,
      CANCEL_FRONTEND_URL: process.env.SSL_CANCEL_FRONTEND_URL as string,
    },
  };
};

const envVars = loadEnvs();
export default envVars;
