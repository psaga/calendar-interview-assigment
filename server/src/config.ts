export const config = {
  port: Number(process.env.PORT) || 3000,
  apiPath: process.env.API_PATH,
  jwtSaltRound: Number(process.env.JWT_SALT_ROUND) || 10,
  jwtHash: process.env.JWT_HASH || "",
  jwtAuthHashExpiration: process.env.JWT_AUTH_HASH_EXPIRATION,
  jwtSlotHashExpiration: process.env.JWT_SLOT_HASH_EXPIRATION,
  mongoConnection: process.env.MONGO_CONNECTION,
  mailUser: process.env.MAIL_USER,
  mailPass: process.env.MAIL_PASS,
  urlApp: process.env.URL_APP,
};