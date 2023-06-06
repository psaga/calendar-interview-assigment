import { Request, Response, NextFunction } from "express";
import Router from "express-promise-router";
import * as HttpStatus from "http-status-codes";
import { create, getUser } from '../services/users';
import { hashPassword, comparePassword, createAuthToken } from "../utils/crypto";

const router = Router();

const checkCredentials = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    if(!username || !password) {
        res.status(HttpStatus.BAD_REQUEST).send({message: 'Username and password have to be provided.'});
        return;
    } else {
        next();
    }
  }
}

router.post('/login', checkCredentials(), async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const user = await getUser(username);
        if(user) {
            const passwordComparison = await comparePassword(password, user.password);
            if(passwordComparison) {
                const token = createAuthToken({user: user.id});
                res.status(HttpStatus.OK).send({username: user.username, token});
                return;
            }
        }
    res.status(HttpStatus.StatusCodes.UNAUTHORIZED).send({message: 'The username or password is not valid.'});
    } catch(err) {
        res.status(HttpStatus.StatusCodes.BAD_REQUEST).send({message: 'Oops! Something gone wrong.'});
    }
});

router.post('/sign-up', checkCredentials(), async (req: Request, res: Response) => {
    const { name, surname, username, password, email } = req.body;
    try {
        const passwordHashed = await hashPassword(password);
        const user = await create(name, surname, username, passwordHashed, email);
        const token = createAuthToken({ user: user.id });
        
        res.status(HttpStatus.StatusCodes.CREATED).send({ username, token });
    } catch(err) {
        if(err.errors?.username) {
            res.status(HttpStatus.StatusCodes.BAD_REQUEST).send({message: err.errors.username.message });
        } else if(err.errors?.mail) {
            res
              .status(HttpStatus.StatusCodes.BAD_REQUEST)
              .send({ message: err.errors.mail.message });
        } else {
            res.status(HttpStatus.StatusCodes.BAD_REQUEST).send({message: 'Oops! Something gone wrong.'});
        }
    }
});

export default router;