import jwt, { SignOptions } from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import envVars from "../config/env";

// Generate JWT
const generateJWT = (payload: JwtPayload) => {
  const token = jwt.sign(payload, envVars.JWT_SECRET, {
    expiresIn: envVars.JWT_EXPIRESIN,
  } as SignOptions);

  return token;
};

// Verfiy & decode JWT
const verifyJWT = (token: string, secret: string) => {
  const verifiedToken = jwt.verify(token, secret);
  return verifiedToken;
};

export { generateJWT, verifyJWT };
