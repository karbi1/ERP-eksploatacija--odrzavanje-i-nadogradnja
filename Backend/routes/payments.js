const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST);

const Order = require("../models/Order");
const ordersController = require("../controllers/orders-controller");

const router = express.Router();

const endpointSecret =
  "sk_test_51L9yuIAkxi9Nq98fwWEujP9ga05TEpLswGuG4WMSOWdPt2ZLYExHMXwNgzDMkjp3YRY9yBi9nBn2GcDV2um840TW00gA3Sq5gk";

router.post("/", async (req, res) => {
  let { amount, id, orderId, customerId } = req.body;

  var param = {};
  param.email = "mike@gmail.com";
  param.name = "Nikola";
  param.description = "from node: " + customerId;

  var custId;

  let customer = await stripe.customers.create(
    param,
    async function (err, customer) {
      if (err) {
        console.log("err: " + err);
      }
      if (customer) {
        console.log("success: " + customer.id);
        try {
          const payment = await stripe.paymentIntents.create({
            amount: amount,
            currency: "USD",
            description: orderId,
            payment_method: id,
            confirm: true,
            customer: customer.id,
          });

          res.json({
            message: "Payment successful",
            success: true,
          });
        } catch (error) {
          console.log("error ", error);
          res.json({ message: "Payment failed", success: false });
        }
      } else {
        console.log("Something wrong");
      }
    }
  );
});

router.post(
  "/webhook",
  express.json({ type: "application/json" }),
  async (request, response) => {
    const event = request.body;

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log("succeeded: ", paymentIntent);
        let order;
        try {
          order = await Order.findById(paymentIntent.description);
          order.paid = true;
          await order.save();
          console.log("PAID IN FULL");
        } catch (err) {}

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
