import apiBase from './base';

export const getSlots = async (dateRef: Date) => {
    const minDate = new Date(dateRef.setHours(1, 0, 0, 0)).getTime();
    const maxDate = minDate + 7 * 24 * 60 * 60 * 1000;

    const response = await apiBase.get("slots", {params: {minDate, maxDate}});
    return response.data;
};

export const setSlotAvailable = async (date: Date) => {
    const response = await apiBase.post("slots", {date});
    return response.data;
};

export const setSlotDisable = async (slotId: string) => {
    const response = await apiBase.delete("slots/" + slotId);
    return response.data;
};

export const scheduleInterview = async (slotId: string, candidate: Candidate, interviewerId: string) => {
  const response = await apiBase.put("slots/" + slotId + "/schedule", {
    candidate,
    interviewerId
  });
  return response.data;
};

export const confirmInterview = async (token: string) => {
  const response = await apiBase.put("slots/confirm", {token}, 
    {
      headers: {
        'Authorization': 'Bearer ' + token
    }
  });
  return response.data;
};

export const cancelInterviewToken = async (token: string) => {
  const response = await apiBase.put(
    "slots/cancel",
    { token },
    {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }
  );
  return response.data;
};

export const cancelInterview = async (slotId: string) => {
  const response = await apiBase.put("slots/cancel", {slotId});
  return response.data;
};
