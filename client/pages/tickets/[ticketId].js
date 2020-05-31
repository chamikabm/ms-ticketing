// This is a wildcard page which uses special next.js syntax for the page name.
// For navigate to this page please refer usage of this page inside the index.js (i e: LandingPage)
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const TicketShow = ({ ticket }) => {

  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => Router.push('/orders/[orderId]', `/orders/${order.id}`),
  });

  return (
      <div>
        <h1>{ticket.title}</h1>
        <h4>Price : {ticket.price}</h4>
        {errors}
        <button
            onClick={doRequest}
            className="btn btn-primary">
          Purchase
        </button>
      </div>
  );
};

TicketShow.getInitialProps = async (context, client, currentUser) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  // This ticket will be available in the above TicketShow as input props.
  return { ticket: data };
};

export default TicketShow;
