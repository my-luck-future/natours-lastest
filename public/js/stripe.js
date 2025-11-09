/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51SQrdQ1ujSYfkiIV8wNxyhUlDWfs3j6AW9YTbJzOZ2COSe7wgXG6EkAHQ12n3CXTUpKgWZ8TEMqThLTr3I30VbDT002tUWkxUf'
);

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    console.log(session);
    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
