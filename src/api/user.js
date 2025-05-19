import axios from "axios";

// export const updateUserPreferences = async (prefs, token) => {
//   const apiUrl = import.meta.env.VITE_API_URL;

//   const response = await axios.put(`${apiUrl}/api/user/preferences`, prefs, {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token || ""}`,
//     },
//   });

//   return response.data;
// };

export const updateUser = async (data, userId) => {
  console.log("Updating user preferences:", data, userId);
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const res = await axios.put(`${apiUrl}/api/user/${userId}`, data);
    return res.data;
  } catch (error) {
    return { error };
  }
};
