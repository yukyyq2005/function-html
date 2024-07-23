import { Stripe } from 'stripe';

// 初始化 Stripe 库
const stripe = new Stripe('sk_test_51PcjxQB24bjbNkTbuJgWcro7epMqu483jc2ZBzRhE1w6rONwiMtQ3KIxFYtG5v1eE5jCWZtEmlyoAQSPwyudgOEB00H0htw0fQ');

export async function onRequest(context) {
  const { request } = context;
  const YOUR_DOMAIN = "http://localhost:8787";
    const session = await stripe.checkout.sessions.create({
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'T-shirt',
          },
          unit_amount: 2000,
        },
        quantity: 1,
      }],
      payment_method_types: [
        'card',
      ],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/success.html`,
      cancel_url: `${YOUR_DOMAIN}/cancel.html`,
    });
    return Response.redirect(session.url)
}
