import { Response } from "express";

interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

// Set tokens in cookies
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

// Clear tokens from cookies
const clearCookies = (res: Response) => {
  // Clear access token
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  // Clear refresh token
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
};

export { setCookies, clearCookies };
