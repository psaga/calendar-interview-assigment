import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { config } from "../config";

export const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, config.jwtSaltRound);
  return hashedPassword;
};

export const comparePassword = (password: string, userPassword: string) => {
  const comparison = bcrypt.compare(password, userPassword);
  return comparison;
};

export const createAuthToken = (data: any) => {
  const token = jwt.sign(data, config.jwtHash, { expiresIn: config.jwtAuthHashExpiration });
  return token;
};

export const createConfirmSlotToken = (data: any) => {
  const token = jwt.sign(data, config.jwtHash, { expiresIn: config.jwtSlotHashExpiration });
  return token;
};

export const createCancelSlotToken = (data: any, expiresIn: string) => {
  const token = jwt.sign(data, config.jwtHash, { expiresIn: expiresIn });
  return token;
};