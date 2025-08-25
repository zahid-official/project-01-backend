import { Response } from "express";

interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

const setCookies = (res: Response, tokenInfo: AuthTokens) => {
  // Set access token in cookies
  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: false,
    });
  }

  // Set refresh token in cookies
  if (tokenInfo.refreshToken) {
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      httpOnly: true,
      secure: false,
    });
  }
};

export default setCookies;
