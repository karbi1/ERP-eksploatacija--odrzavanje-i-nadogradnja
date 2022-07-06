import React, { useState, useContext } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";

import { AuthContext } from "../../shared/context/auth-context";

const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#c4f0ff",
      color: "#fff",
      fontWeight: 500,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": { color: "#fce883" },
      "::placeholder": { color: "#87bbfd" },
    },
    invalid: {
      iconColor: "#ffc7ee",
      color: "#ffc7ee",
    },
  },
};

export default function PaymentForm(props) {
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [status, setStatus] = useState();
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (!error) {
      try {
        const { id } = paymentMethod;
        const response = await axios.post("http://localhost:5000/payments", {
          amount: props.amount,
          id,
          orderId: props.orderId,
          customerId: auth.userId,
        });

        if (response.data.success) {
          console.log("successful payment");
          console.log(response.data.success);
        }
        setStatus(response.data.success);
      } catch (error) {
        console.log("error: ", error);
      }
    } else {
      console.log(error.message);
    }
    setFinished(true);
    setLoading(false);
  };

  const auth = useContext(AuthContext);

  return (
    <>
      {loading && <div>Processing.</div>}
      {!finished && (
        <form onSubmit={handleSubmit}>
          <fieldset className="FormGroup">
            <div className="FormRow">
              <CardElement options={CARD_OPTIONS} />
            </div>
          </fieldset>
          <button>Pay</button>
        </form>
      )}
      {!loading && finished && status && <div>Success </div>};
      {!loading && finished && !status && <div>Failed</div>};
    </>
  );
}
