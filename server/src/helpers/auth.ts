import { sign } from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { User, IUserModel, IUserDocument } from "../models/userModel";
import { logger } from "./logger";
import { config } from "./config";
import cookieParser from "cookie-parser";

export interface Req extends Request {
  userId?: string
}

export interface MyContext {
  req: Req
  res: Response
}

interface ITokenData {
  userId: string | null
  authCount?: number | null
}

export const createTokens = (user: IUserDocument): { refreshToken: string, accessToken: string } => {
  const refreshToken = sign(
    { userId: user._id, authCount: user.authCount },
    config.REFRESH_TOKEN_SECRET, { expiresIn: "7d" }
  );
  const accessToken = sign(
    { userId: user._id },
    config.ACCESS_TOKEN_SECRET, { expiresIn: "15min" }
  );

  return { refreshToken, accessToken };
};

export const verifyRefreshToken = (refreshToken: string | null): ITokenData => {
  let data: ITokenData = {
    userId: null,
    authCount: null,
  };
  try {
    if (!refreshToken) return data;
    data = verify(refreshToken, config.REFRESH_TOKEN_SECRET) as ITokenData;
  } catch { }
  return data;
}

export const authMiddleware = async (req: Req, res: Response, next: () => void) => {
  const refreshToken = req.cookies ? req.cookies["refresh-token"] : null;
  const accessToken = req.cookies ? req.cookies["access-token"] : null;

  if (!refreshToken && !accessToken) return next();

  try {
    const data = verify(accessToken, config.ACCESS_TOKEN_SECRET) as ITokenData;
    if (data.userId) req.userId = data.userId;
    return next();
  } catch { }

  if (!refreshToken) return next(); // expired access token

  const data = verifyRefreshToken(refreshToken);

  const user = await User.findOne({ where: { id: data.userId } });
  if (!user || user.authCount !== data.authCount) return next(); // token has been invalidated

  const tokens = createTokens(user);

  // res.cookie("refresh-token", tokens.refreshToken);
  // res.cookie("access-token", tokens.accessToken);
  if (data.userId) req.userId = data.userId;

  next();
}

export const withAuth = async (req: Req, res: Response, next?: NextFunction): Promise<IUserDocument> => {
  if (!req.userId)
    throw new Error('User not logged in')

  const user = await User.findById(req.userId)
    .catch(error => { throw new Error('User not found in database') })

  if (!user)
    throw new Error('User not found by ID')

  if (next)
    next()

  return user
}

export function parseCookies(cookies: string): Map<string, string> {
  let result = new Map<string, string>()
  cookies.split(";").forEach((cookie) => {
    const split = cookie.trim().split("=");
    if (split.length === 2)
      result.set(split[0], split[1]);
  });
  return result;
}

interface IVerifySocketCookiesResult {
  authenticated: boolean
  userID: string | null
}

export function verifySocketCookies(cookies: string | undefined): IVerifySocketCookiesResult {
  let result: IVerifySocketCookiesResult = {
    authenticated: false, 
    userID: null
  }

  if (!cookies) {
    result.authenticated = false
    return result
  }

  const getTokens = () => {
    let _tokens: { refreshToken: null | string, accessToken: null | string }
      = { refreshToken: null, accessToken: null }
    cookies.split(";").forEach((cookie) => {
      const split = cookie.trim().split("=");
      if (split.length === 2)
        if (split[0] === 'refresh-token')
          _tokens.refreshToken = split[1]
        else if (split[0] === 'access-token')
          _tokens.accessToken = split[1]
    });
    return _tokens;
  }

  const verifyCookies = (accessToken: string, refreshToken: string): IVerifySocketCookiesResult => {
    let _result: IVerifySocketCookiesResult = {
      authenticated: false,
      userID: null
    }

    const refresh = verify(refreshToken, config.REFRESH_TOKEN_SECRET) as ITokenData
    const access = verify(accessToken, config.ACCESS_TOKEN_SECRET) as ITokenData

    if (!access.userId || !refresh.userId)
      _result.authenticated = false    
    else if (access.userId !== refresh.userId)
      _result.authenticated = false
    else
      _result = {
        authenticated: true,
        userID: access.userId
      }

    return _result
  }

  const tokens = getTokens()

  if (!tokens.accessToken || !tokens.refreshToken) {
    result.authenticated = false
    return result
  }

  return verifyCookies(tokens.accessToken, tokens.refreshToken)
}