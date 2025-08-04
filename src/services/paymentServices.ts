import api from "./api";
import { PaymentRequest } from "../types";
export async function sendPaymentInfo(formData: FormData) {
  for (const pair of formData.entries()) {
    console.log(pair[0] + ": " + pair[1]);
  }
  const res = await api.post("/payment/", formData, {});
  return res.data;
}
const userPaymentRequests: PaymentRequest[] = [
  {
    id: "req_1A2b3C",
    userId: "usr_12345",
    fullName: "John Doe",
    bankName: "Chase Bank",
    billScreenshotUrl: "#",
    status: "Approved",
    createdAt: "2025-08-01T10:00:00Z",
    updatedAt: "2025-08-01T14:20:00Z",
  },
  {
    id: "req_4D5e6F",
    userId: "usr_12345",
    fullName: "John Doe",
    bankName: "Bank of America",
    billScreenshotUrl: "#",
    status: "Pending",
    createdAt: "2025-08-03T11:00:00Z",
    updatedAt: "2025-08-03T11:00:00Z",
  },
  {
    id: "req_7G8h9I",
    userId: "usr_12345",
    fullName: "John Doe",
    bankName: "Wells Fargo",
    billScreenshotUrl: "#",
    status: "Rejected",
    rejectionReason: "The name on the bill did not match your account name.",
    createdAt: "2025-07-15T09:00:00Z",
    updatedAt: "2025-07-15T16:45:00Z",
  },
  {
    id: "req_J1K2L3",
    userId: "usr_12345",
    fullName: "John Doe",
    bankName: "Citibank",
    billScreenshotUrl: "#",
    status: "Rejected",
    createdAt: "2025-06-20T12:00:00Z",
    updatedAt: "2025-06-30T12:00:00Z",
    expirationDate: "2025-06-30T12:00:00Z",
  },
];

// Simulate fetching data for a specific user
export const fetchUserPaymentRequests = async (
  userId: string
): Promise<PaymentRequest[]> => {
  const res = await api.get(`/payment/${userId}`);
  return res.data.payments;
};
