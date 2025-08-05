import api from "./api";
import { PaymentRequest } from "../types";
export async function sendPaymentInfo(formData: FormData) {
  for (const pair of formData.entries()) {
    console.log(pair[0] + ": " + pair[1]);
  }
  const res = await api.post("/payment/", formData, {});
  return res.data;
}

export const fetchUserPaymentRequests = async (
  userId: string
): Promise<PaymentRequest[]> => {
  const res = await api.get(`/payment/${userId}`);
  return res.data.payments;
};
