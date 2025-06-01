const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("getToken data:", user);
  return user ? user?.data.token : null;
};

export const getUserId = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("getUserId data:", user);
  return user ? user?.data.user._id : null;
};

export const createHeaders = () => {
  const token = getToken();
  if (!token) {
    return {
      "Content-Type": "application/json",
    };
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};
