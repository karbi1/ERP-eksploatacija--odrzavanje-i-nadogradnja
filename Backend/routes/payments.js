const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST);

const router = express.Router();

const endpointSecret =
  "sk_test_51L9yuIAkxi9Nq98fwWEujP9ga05TEpLswGuG4WMSOWdPt2ZLYExHMXwNgzDMkjp3YRY9yBi9nBn2GcDV2um840TW00gA3Sq5gk";

router.post("/", async (req, res) => {
  let { amount, id } = req.body;
  try {
    const payment = await stripe.paymentIntents.create({
      amount: amount,
      currency: "USD",
      description: "Order",
      payment_method: id,
      confirm: true,
    });

    console.log("Payment: ", payment);

    res.json({
      message: "Payment successful",
      success: true,
    });
  } catch (error) {
    console.log("error ", error);
    res.json({ message: "Payment failed", success: false });
  }
});

router.post(
  "/webhook",
  express.json({ type: "application/json" }),
  (request, response) => {
    const event = request.body;

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log("succeeded: ", paymentIntent);
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break;
      case "payment_method.attached":
        const paymentMethod = event.data.object;
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    response.json({ received: true });
  }
);

module.exports = router;
