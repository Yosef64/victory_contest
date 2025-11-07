import { useEffect, useState } from "react";
import { PaymentRequest } from "../types";
import { fetchUserPaymentRequests } from "../services/paymentServices";
import { useTelegram } from "../hooks/useTelegram";
import { Alert, AlertTitle } from "../components/ui/alert";
import { PopcornIcon, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function PaymentAlert({
  onVisibilityChange,
}: {
  onVisibilityChange?: (isVisible: boolean) => void;
}) {
  const { user: tgUser } = useTelegram();
  const navigate = useNavigate();

  const [payments, setpayments] = useState<PaymentRequest[] | null>(null);
  const [isVisible, setIsVisible] = useState(true); // <-- 2. Add state for visibility

  useEffect(() => {
    if (!tgUser?.id) return;
    const fetchUserPayments = async () => {
      try {
        const payments = await fetchUserPaymentRequests(tgUser?.id.toString());
        setpayments(payments);
      } catch (err) {}
    };
    fetchUserPayments();
  }, [tgUser]);

  if (payments == null) {
    return null;
  }

  const THREE_DAYS_IN_MS = 3 * 24 * 60 * 60 * 1000;

  let isAboutToExpire = false;
  for (let index = 0; index < payments.length; index++) {
    const payment = payments[index];
    if (payment.status != "Approved") {
      continue;
    }
    const timeDiff = new Date(payment.expirationDate!).getTime() - Date.now();
    if (timeDiff > THREE_DAYS_IN_MS) {
      isAboutToExpire = false;
      break;
    }

    if (timeDiff <= THREE_DAYS_IN_MS) {
      isAboutToExpire = true;
    }
  }

  if (!isAboutToExpire || !isVisible) {
    return null;
  }
  onVisibilityChange?.(isVisible);
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
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 rounded-full hover:bg-yellow-200/60"
        aria-label="Dismiss"
      >
        <X className="h-5 w-5" />
      </button>
    </Alert>
  );
}
