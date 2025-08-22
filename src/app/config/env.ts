import "dotenv/config";
import EnvConfig from "./env.interface";

const loadEnvs = (): EnvConfig => {
  // Check missing envs
  const requiredEnvs: string[] = [
    "DB_URL",
    "PORT",
    "NODE_ENV",
    "JWT_SECRET",
    "JWT_EXPIRESIN",
    "BCRYPT_SALT_ROUNDS",
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
    JWT_SECRET: process.env.JWT_SECRET as string,
    JWT_EXPIRESIN: process.env.JWT_EXPIRESIN as string,
    BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS as string,
  };
};

const envVars = loadEnvs();
export default envVars;
