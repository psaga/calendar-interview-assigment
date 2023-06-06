import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import * as HttpStatus from "http-status-codes";

export const verifyToken = (hash: string) => {
  return function (req: Request, res: Response, next: NextFunction) {
    const bearer = req.headers["authorization"];
    if (bearer) {
      const token = bearer.split(" ")[1];
      if (token) {
        jwt.verify(token, hash, (err: any, data: any) => {
          if (err) {
            res
              .status(HttpStatus.StatusCodes.UNAUTHORIZED)
              .send({ tokenInvalid: true });
          } else {
            req.body.dataToken = data;
            next();
          }
        });
      } else {
        res
          .status(HttpStatus.StatusCodes.UNAUTHORIZED)
          .send({ tokenInvalid: true });
      }
    } else {
      req.body.dataToken = "";
      next();
    }
  };
};
