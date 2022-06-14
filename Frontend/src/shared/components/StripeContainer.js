import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import PaymentForm from "./PaymentForm";

const PUBLIC_KEY =
  "pk_test_51L9yuIAkxi9Nq98fyS62Mg5RFF3QoGW0sjU7nEhuNk9Oa8w9YuQKoZCoqEWkRPnDQVeumv8Y2xFAjJC6eGvdBoMB00RhHQiSlB";

const stripeTestPromise = loadStripe(PUBLIC_KEY);

export default function StripeContainer(props) {
  return (
    <Elements stripe={stripeTestPromise}>
      <PaymentForm amount={props.amount} />
    </Elements>
  );
}
