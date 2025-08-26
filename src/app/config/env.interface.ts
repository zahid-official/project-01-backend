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
}

export default EnvConfig;
