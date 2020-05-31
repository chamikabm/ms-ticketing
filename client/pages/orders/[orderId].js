import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => console.log(payment),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft/1000));
    };

    findTimeLeft(); // Call on Mount, because we need to see the time value on Mount and following
    // setInterval only set after one second after mounting the component.
    const timerId = setInterval(findTimeLeft, 1000); // Call on Every Second

    // This return statement will get executed when un-mounting the component.
    // We use this return function execution to clear the previously set setInterval,
    // otherwise this setInterval will execute even after we navigate out of
    // this component(i.e: Un-mount)

    // Also note that this return function get executed upon un-mouting and re rendering.
    // Re rendering only occurs when the variables inside [] array of the useEffect hook,
    // but in this scenario it not occur as we have an empty array, which means this functions
    // only get executed when this component get un-mounted, as there is no rerender happens.
    return () => {
      clearInterval(timerId);
    }
  }, []);

  if(timeLeft < 0) {
    return (
        <div>Order expired</div>
    );
  }


  return (
      <div>
        Time left to pay: {timeLeft} seconds
        <StripeCheckout
            token={(token) => doRequest({ token: token.id })}
            stripeKey={'pk_test_TiqYdawHGinlnASWTXqs3nbv00mrzTdDC7'}
            // Since stripe works smallest amount of the currency, as we are using USD as out
            // currency we need to convert the ticket amount to USD cents by multiplying the price
            // by 100
            amount={order.ticket.price*100}
            email={currentUser.email}
        />
        {errors}
      </div>
  );
};

OrderShow.getInitialProps = async (context, client, currentUser) => {
  const { orderId } = context.query;
  const { data } = await client.get(`api/orders/${orderId}`);

  // This order will be available in the above OrderShow as input props.
  return { order: data };
};

export default OrderShow;


