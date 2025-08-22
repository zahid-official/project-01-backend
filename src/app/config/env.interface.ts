interface EnvConfig {
  DB_URL: string;
  PORT: string;
  NODE_ENV: "development" | "production";
  JWT_SECRET: string;
  JWT_EXPIRESIN: string;
  BCRYPT_SALT_ROUNDS: string;
  SUPER_ADMIN_EMAIL: string;
  SUPER_ADMIN_PASSWORD: string;
}

export default EnvConfig;
