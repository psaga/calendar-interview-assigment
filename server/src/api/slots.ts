import { Request, Response } from 'express';
import Router from "express-promise-router";
import * as HttpStatus from "http-status-codes";
import { config } from '../config';
import {
  getSlots,
  setSlotAvailable,
  setSlotDisable,
  scheduleInterview,
  confirmInterview,
  cancelInterview,
} from "../services/slots";
import { verifyToken } from '../middlewares/verifyToken';

const router = Router();

router.get(
  "/",
  verifyToken(config.jwtHash),
  async (req: Request, res: Response) => {
    try {
      const userId = req.body.dataToken.user;
      const minDate = new Date(Number(req.query.minDate));
      const maxDate = new Date(Number(req.query.maxDate));

      const slots = await getSlots(minDate, maxDate, userId);
      res.status(HttpStatus.OK).send(slots);
    } catch (err) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: "Oops! Something gone wrong." });
    }
  }
);

router.post(
  "/",
  verifyToken(config.jwtHash),
  async (req: Request, res: Response) => {
    try {
      const userId = req.body.dataToken.user;
      const { date } = req.body;

      if (!userId) {
        res.status(HttpStatus.StatusCodes.FORBIDDEN);
        return;
      }
      if (
        isNaN(new Date(date).getTime()) ||
        new Date(date).getTime() < new Date().getTime()
      ) {
        res
          .status(HttpStatus.StatusCodes.BAD_REQUEST)
          .send({ message: "The date is not valid." });
        return;
      }

      const slotCreated = await setSlotAvailable(userId, date);

      res.status(HttpStatus.StatusCodes.OK).send(slotCreated);
    } catch (err) {
      res
        .status(HttpStatus.StatusCodes.BAD_REQUEST)
        .send({ message: "Oops! Something gone wrong." });
    }
  }
);

router.delete(
  "/:slotId",
  verifyToken(config.jwtHash),
  async (req: Request, res: Response) => {
    try {
      const userId = req.body.dataToken.user;
      const slotId = req.params.slotId;

      await setSlotDisable(userId, slotId);
      res.status(HttpStatus.StatusCodes.OK).send("ok");
    } catch (err) {
      res
        .status(HttpStatus.StatusCodes.BAD_REQUEST)
        .send({ message: "Oops! Something gone wrong." });
    }
  }
);

router.put("/:slotId/schedule", async (req: Request, res: Response) => {
  try {
    const { candidate, interviewerId } = req.body;
    const slotId = req.params.slotId;
    if (
      !candidate ||
      !candidate.name ||
      !candidate.surname ||
      !candidate.email
    ) {
      res
        .status(HttpStatus.StatusCodes.BAD_REQUEST)
        .send({ message: "Some data of candidate is missing." });
      return;
    }
    await scheduleInterview(slotId, candidate, interviewerId);
    res.status(HttpStatus.StatusCodes.OK).send(slotId);
  } catch (err) {
    console.log(err);
    res.status(HttpStatus.StatusCodes.BAD_REQUEST).send({ message: err.message });
  }
});

router.put(
  "/confirm",
  verifyToken(config.jwtHash),
  async (req: Request, res: Response) => {
    try {
      const slotData = req.body.dataToken;
      await confirmInterview(slotData);
      res.status(HttpStatus.StatusCodes.OK).send(slotData.slotId);
    } catch (err) {
      console.log(err);
      res.status(HttpStatus.StatusCodes.BAD_REQUEST).send({ message: err.message });
    }
  }
);

router.put(
  "/cancel",
  verifyToken(config.jwtHash),
  async (req: Request, res: Response) => {
    try {
      const tokenData = req.body.dataToken;
      let slotId;
      let userId;
      if(tokenData.user) {
        slotId = req.body.slotId;
        userId = tokenData.user;
      } else {
        slotId = tokenData.slotId;
      }
      await cancelInterview(slotId, userId);
      res.status(HttpStatus.StatusCodes.OK).send(slotId);
    } catch (err) {
      res.status(HttpStatus.StatusCodes.BAD_REQUEST).send({ message: err.message });
    }
  }
);

export default router;