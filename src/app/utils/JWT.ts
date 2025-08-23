import jwt, { SignOptions } from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import envVars from "../config/env";

// Generate JWT
const generateJWT = (payload: JwtPayload) => {
  const token = jwt.sign(payload, envVars.JWT_ACCESS_SECRET, {
    expiresIn: envVars.JWT_ACCESS_EXPIRESIN,
  } as SignOptions);

  return token;
};

export { generateJWT };
