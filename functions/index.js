/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// export default {
// 	async fetch(request, env, ctx) {
//         console.log('dd');
// 		return new Response('Hello World!');
// 	},
// };

import { Stripe } from 'stripe';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;
    

    // 忽略 /favicon.ico 请求
    if (pathname === "/favicon.ico") {
        // console.log("不处理 favicon");
      return new Response(null, { status: 204 });
    }

    console.log(pathname);

    if (pathname === '/create-checkout-session') {
      return await handleCreatePaymentIntent(request, env);
    }

    if (pathname.startsWith('/api/')) {
      // 处理 API 请求
      console.log('222');
      return new Response('Hello World 1!');
    } else {
        console.log('333');
      // 处理静态网站请求
      return new Response('Hello World 2!');
      // return handleStaticSiteRequest(request);
    }
  },
};
async function handleCreatePaymentIntent(request, env) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  const stripe_key = 'sk_test_51PcjxQB24bjbNkTbuJgWcro7epMqu483jc2ZBzRhE1w6rONwiMtQ3KIxFYtG5v1eE5jCWZtEmlyoAQSPwyudgOEB00H0htw0fQ';

  const stripe = new Stripe(stripe_key, {
    httpClient: Stripe.createFetchHttpClient(),
  });
  console.log('***** beign *****');
  // const { amount, username } = await request.json();
  // const formData = await request.formData();
  // const amount = parseInt(formData.get('amount'), 10);
  console.log('***** end *****');
  const payment_method_types = "card";
  const currency = "usd";
  const YOUR_DOMAIN = "http://localhost:8787";

  try {

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
    
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount:2000,
    //   currency:'usd',
    // });
    // return new Response(JSON.stringify(paymentIntent), {
    //   headers: { 'Content-Type': 'application/json' },
    //   status: 201,
    // });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    });
  }
}
// 处理静态网站请求的函数
async function handleStaticSiteRequest(request) {
  // 将请求转发到存储静态网站的源服务器
  const originUrl = new URL(request.url);
console.log(request.url);
  originUrl.hostname = 'h5.pipiform.com'; // 替换为你的源服务器地址
  const response = await fetch(originUrl.toString(), request);
  return response;
}



