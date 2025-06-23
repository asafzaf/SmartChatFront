import axios from "axios";

import { createHeaders } from "./api.conf";

export const updateUser = async (data, userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required to update user preferences");
    }
    const headers = createHeaders();
    const apiUrl = import.meta.env.VITE_API_URL;
    const res = await axios.put(
      `${apiUrl}/api/user/${userId}`,
      {
        ...data,
        userId: userId,
      },
      {
        headers: headers,
      }
    );
    return res.data;
  } catch (error) {
    console.error("ERROR updating user preferences:", error);
    throw error;
  }
};
