import { Slot } from "../database/models/slot";
import { User } from "../database/models/user";
import { transporter } from "../utils/mail";
import { createConfirmSlotToken, createCancelSlotToken } from "../utils/crypto";
import { pendingInterviewTemplate, interviewConfirmedTemplate, interviewCanceledTemplate } from "../utils/emailTemplates";

export const getSlots = async (minDate: Date, maxDate: Date, userId?: string): Promise<any[]> => {

    if(userId) {
        return await Slot.find({user: userId, date: {$gte: minDate, $lt: maxDate}}, '-user -__v');
    } else {
        const today = new Date();
        if(minDate.getTime() < today.getTime()) {
            minDate = today;
        }
        return await Slot.find({candidate: null, date: {$gte: minDate, $lt: maxDate}}).populate('user', '-password -__v -username -mail');
    }
}

export const setSlotAvailable = async (userId: string, date: Date): Promise<void> => {
    const slotFound = await Slot.findOne({date, user: userId});
    if(slotFound) {
        throw new Error("The user has this slot already");
    } else {
        const slot = new Slot({
          date,
          user: userId,
        });
        return await slot.save();
    }
};

export const setSlotDisable = async (userId: string, slotId: string): Promise<void> => {
    await Slot.deleteOne({_id: slotId, user: userId});
};

export const scheduleInterview = async (slotId: string, candidate: any, interviewerId: string): Promise<void> => {
    
    const slotFound = await Slot.findById(slotId);
    if (!slotFound) {
      throw new Error("Slot not found");
    } else if (slotFound.candidate) {
      throw new Error("The slot has an interview assigned");
    }

    const foundUser = await User.findById(interviewerId);
    if (!foundUser) {
      throw new Error("User not found");
    }

    const token = createConfirmSlotToken({ slotId, candidate, interviewerId });
    const interviewerName = `${foundUser.name} ${foundUser.surname}`;
    const interviewDate = `${slotFound.date.getUTCMonth()}/${slotFound.date.getUTCDate()} - ${slotFound.date.getUTCHours()}:00 UTC`;
    const template = pendingInterviewTemplate(
      interviewerName,
      interviewDate,
      token
    );

    transporter.sendMail({
      from: '"Interviews Schedule" <calendar.interviews.assignment@gmail.com>',
      to: candidate.email,
      subject: "Confirm Interview",
      html: template
    });
}

export const confirmInterview = async (slotData: any): Promise<void> => {
  const slotFound = await Slot.findById(slotData.slotId);
  if (!slotFound || slotFound.candidate) {
    throw new Error("This interview is not longer available to confirm");
  } else {
      slotFound.candidate = slotData.candidate;
      await slotFound.save();

      const foundUser = await User.findById(slotData.interviewerId);

      const timeUntilInterviewInMS =
        slotFound.date.getTime() - new Date().getTime();
      const expiresInHours = Math.floor(timeUntilInterviewInMS / 3600) % 24;
      const token = createCancelSlotToken(
        { slotId: slotFound._id },
        `${expiresInHours}h`
      );
      const interviewerName = `${foundUser.name} ${foundUser.surname}`;
      const interviewDate = `${slotFound.date.getUTCMonth()}/${slotFound.date.getUTCDate()} - ${slotFound.date.getUTCHours()}:00 UTC`;

      const templateMailCandidate = interviewConfirmedTemplate(interviewerName, interviewDate, token);

      await transporter.sendMail({
        from:
          '"Interviews Schedule" <calendar.interviews.assignment@gmail.com>',
        to: slotData.candidate.email,
        subject: "Interview Confirmed",
        html: templateMailCandidate
      });


      const candidateName = `${slotData.candidate.name} ${slotData.candidate.surname}`;
      const templateMailInterviewer = interviewConfirmedTemplate(
        candidateName,
        interviewDate,
        token
      );

      transporter.sendMail({
        from:
          '"Interviews Schedule" <calendar.interviews.assignment@gmail.com>',
        to: foundUser.email,
        subject: "Interview Assigned",
        html: templateMailInterviewer,
      });

    }
}

export const cancelInterview = async (slotId: string, userId?: string): Promise<void> => {
  const slotFound = await Slot.findById(slotId);
  if (!slotFound) {
    throw new Error("The interview is not longer available");
  } else if (userId && userId != slotFound.user._id) {
      throw new Error("You are not allowed to cancel this interview");
  } else if (!slotFound.candidate) {
      throw new Error("The interview has been cancelled before");
  } else {
        const candidate = slotFound.candidate;
        slotFound.candidate = null;
        await slotFound.save();

        const foundUser = await User.findById(slotFound.user._id);

        const interviewerName = `${foundUser.name} ${foundUser.surname}`;
        const interviewDate = `${slotFound.date.getUTCMonth()}/${slotFound.date.getUTCDate()} - ${slotFound.date.getUTCHours()}:00 UTC`;

        const templateMailCandidate = interviewCanceledTemplate(
          interviewerName,
          interviewDate
        );

        transporter.sendMail({
          from: '"Interviews Schedule" <calendar.interviews.assignment@gmail.com>',
          to: candidate.email,
          subject: "Interview Canceled",
          html: templateMailCandidate,
        });

        const candidateName = `${candidate.name} ${candidate.surname}`;
        const templateMailInterviewer = interviewCanceledTemplate(
          candidateName,
          interviewDate
        );

        transporter.sendMail({
          from: '"Interviews Schedule" <calendar.interviews.assignment@gmail.com>',
          to: foundUser.email,
          subject: "Interview Canceled",
          html: templateMailInterviewer,
        });
    }
}