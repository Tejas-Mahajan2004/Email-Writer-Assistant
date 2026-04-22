export const setAuthData = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const getToken = () => localStorage.getItem("token");

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};