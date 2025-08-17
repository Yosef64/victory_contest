import { useEffect, useState } from "react";
import { PaymentRequest } from "../types";
import { fetchUserPaymentRequests } from "../services/paymentServices";
import { useTelegram } from "../hooks/useTelegram";
import { Alert, AlertTitle } from "../components/ui/alert";
import { PopcornIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
export default function PaymentAlert() {
  const { user: tgUser } = useTelegram();
  const navigate = useNavigate();

  const [payments, setpayments] = useState<PaymentRequest[] | null>(null);

  useEffect(() => {
    if (!tgUser?.id) return;
    const fetchUserPayments = async () => {
      try {
        const payments = await fetchUserPaymentRequests(tgUser?.id.toString());
        setpayments(payments);
      } catch (err) {
        toast.error("something went wrong", {
          style: {
            backgroundColor: "red",
            color: "white",
          },
        });
      }
    };
    fetchUserPayments();
  }, [tgUser]);

  if (payments == null) {
    return;
  }

  const THREE_DAYS_IN_MS = 3 * 24 * 60 * 60 * 1000;

  const isAboutToExpire = payments.some((payment) => {
    if (payment.status !== "Approved" || !payment.expirationDate) {
      return false;
    }
    const timeDiff = new Date(payment.expirationDate).getTime() - Date.now();
    return timeDiff <= THREE_DAYS_IN_MS && timeDiff >= 0;
  });

  if (!isAboutToExpire) {
    return null;
  }
  return (
    <Alert variant="warning">
      <PopcornIcon />
      <AlertTitle>
        Your Payment is going to be expired. Please subscribe for more.{" "}
        <span
          onClick={() => navigate("/payment")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") navigate("/payment");
          }}
          className="underline cursor-pointer"
        >
          Subscribe
        </span>
      </AlertTitle>
    </Alert>
  );
}
