import axios from "axios";

export const loginWithGoogle = async (idToken) => {
  const res = await axios.post(
    `${import.meta.env.VITE_BACKEND_LOCAL_URL}/google`,
    { idToken },
    {
      withCredentials: true,
    },
  );
  return res.data;
};
