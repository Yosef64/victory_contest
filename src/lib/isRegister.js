import axios from "axios";

export const isRegister = async (id) => {
  const url = import.meta.env.VITE_TgBot;
  try {
    const res = await axios.post(
      "https://victory-tutorial-api.vercel.app/check_user",
      {
        teleid: id,
      },
      {
        withCredentials: true,
      }
    );

    // await axios.post(
    //   `https://api.telegram.org/bot${url}/sendMessage`,
    //   {
    //     chat_id: id,
    //     text: "you are already registered",
    //   },
    //   {
    //     withCredentials: true,
    //   }
    // );

    return res.data.message == false;
  } catch (error) {
    return false;
  }
};
