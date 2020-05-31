// This page is belong to the route of <host_url>/orders
// ie: https://ticketing.dev/orders

const OrderIndex = ({ orders }) => {

  return (
      <u>
        {
          orders.map(order => {
            return (
                <li key={order.id}>
                  {order.ticket.title} - {order.status}
                </li>
            );
          })
        }
      </u>
  );
};

OrderIndex.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/orders');

  return { orders: data };
};

export default OrderIndex;
