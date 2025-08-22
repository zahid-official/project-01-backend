interface EnvConfig {
  DB_URL: string;
  PORT: string;
  NODE_ENV: "development" | "production";
  JWT_SECRET: string;
  JWT_EXPIRESIN: string;
  BCRYPT_SALT_ROUNDS: string;
}

export default EnvConfig;
