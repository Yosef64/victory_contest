import axios from "axios";

export const isRegister = async (id) => {
  const url = import.meta.env.VITE_TgBot;
  const text = "you are already registered";

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
    if (res.data.message == false) {
      await axios.get(
        `https://api.telegram.org/bot${url}/sendMessage?chat_id=${id}&text=${text}`,

        {
          withCredentials: true,
        }
      );
    }

    return res.data.message == false;
  } catch (error) {
    return false;
  }
};
