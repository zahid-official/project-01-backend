interface EnvConfig {
  DB_URL: string;
  PORT: string;
  NODE_ENV: "development" | "production";

  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRESIN: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRESIN: string;

  BCRYPT_SALT_ROUNDS: string;
  SUPER_ADMIN_EMAIL: string;
  SUPER_ADMIN_PASSWORD: string;

  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;

  EXPRESS_SESSION_SECRET: string;
  FRONTEND_URL: string;

  SSL: {
    STORE_ID: string;
    STORE_PASSWORD: string;
    PAYMENT_API: string;
    VALIDATION_API: string;

    SUCCESS_BACKEND_URL: string;
    FAIL_BACKEND_URL: string;
    CANCEL_BACKEND_URL: string;

    SUCCESS_FRONTEND_URL: string;
    FAIL_FRONTEND_URL: string;
    CANCEL_FRONTEND_URL: string;
  };
}

export default EnvConfig;
