import apiBase from "./base";

export const login = async (credentials: Credentials): Promise<UserStore> => {
  const response = await apiBase.post("users/login", credentials, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const signUp = async (credentials: Credentials): Promise<UserStore> => {
  const response = await apiBase.post("users/sign-up", credentials, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};