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
  const [isVisible, setIsVisible] = useState(true); // Internal state for dismissal

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

  // --- Start of logic ---
  // Default to false. Only show if payments are loaded AND about to expire.
  let isAboutToExpire = false;

  if (payments != null) {
    const THREE_DAYS_IN_MS = 3 * 24 * 60 * 60 * 1000;

    for (let index = 0; index < payments.length; index++) {
      const payment = payments[index];
      if (payment.status != "Approved") {
        continue;
      }
      const timeDiff = new Date(payment.expirationDate!).getTime() - Date.now();

      // Note: Your original logic here was slightly flawed.
      // If the first payment expires in 4 days (isAboutToExpire = false)
      // and the second expires in 2 days, it would break and *never* set
      // isAboutToExpire to true.
      // This new logic correctly finds *any* payment about to expire.
      if (timeDiff <= THREE_DAYS_IN_MS && timeDiff > 0) {
        // Check if it's expiring *and* not already expired
        isAboutToExpire = true;
        break; // Found one, no need to check others
      }
    }
  }
  // --- End of logic ---

  // 1. Calculate the *actual* visibility
  const isAlertVisible = isAboutToExpire && isVisible;

  // 2. Use useEffect to report changes to the parent
  useEffect(() => {
    // This effect runs whenever `isAlertVisible` changes (true -> false or false -> true)
    onVisibilityChange?.(isAlertVisible);
  }, [isAlertVisible, onVisibilityChange]); // Add dependencies

  // 3. Use the calculated state to decide what to render
  if (!isAlertVisible) {
    return null;
  }

  // The alert is visible, so return the JSX.
  // We no longer need the onVisibilityChange call here.
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
        onClick={() => setIsVisible(false)} // This now just sets internal state
        className="absolute top-2 right-2 rounded-full hover:bg-yellow-200/60"
        aria-label="Dismiss"
      >
        <X className="h-5 w-5" />
      </button>
    </Alert>
  );
}
