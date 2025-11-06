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
  onVisibilityChange?: (visible: boolean) => void;
}) {
  const { user: tgUser } = useTelegram();
  const navigate = useNavigate();

  const [payments, setpayments] = useState<PaymentRequest[] | null>(null);
  const [isVisible, setIsVisible] = useState(true); // <-- 2. Add state for visibility

  useEffect(() => {
    if (!tgUser?.id) return;
    const fetchUserPayments = async () => {
      try {
        const payments = await fetchUserPaymentRequests(tgUser.id.toString());
        setpayments(payments);
      } catch (err) {
        console.error("Failed to fetch payments", err);
        setpayments([]);
      }
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

  useEffect(() => {
    onVisibilityChange?.(isAboutToExpire && isVisible);
  }, [isAboutToExpire, isVisible]);
  if (!isAboutToExpire || !isVisible) {
    return null;
  }
  return (
    <Alert
      variant="warning"
      className="relative flex items-start gap-3 rounded-xl border border-yellow-300 bg-yellow-50 text-yellow-900 shadow-sm"
    >
      <PopcornIcon className="mt-1 shrink-0 text-yellow-600" />

      <AlertTitle className="text-sm leading-relaxed">
        Your payment is about to expire. Please
        <span
          onClick={() => navigate("/payment")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") navigate("/payment");
          }}
          className="font-medium underline text-yellow-800 cursor-pointer hover:text-yellow-900"
        >
          subscribe
        </span>
        for more.
      </AlertTitle>

      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-yellow-100 transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4 text-yellow-700" />
      </button>
    </Alert>
  );
}
