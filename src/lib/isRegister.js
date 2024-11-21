import axios from "axios";

export const isRegister = async (id) => {
  const url = import.meta.env.VITE_BACKEND_API;
  try {
    const res = await axios.post(
      `${url}/check_user`,
      {
        teleid: id,
      },
      {
        withCredentials: true,
      }
    );
    if (res.data.message == false) {
      await axios.post(
        `${url}/sendMessage`,
        {
          chat_id: id,
        },
        {
          withCredentials: true,
        }
      );
    }

    return res.data.message === false;
  } catch (error) {
    return true;
  }
};
