import { config } from '../config';
import * as nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.mailUser,
    pass: config.mailPass,
  },
});