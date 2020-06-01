// import buildClient from '../api/build-client';

import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => {
  const rows = tickets.map(({ id, title, price }) => (
      <tr key={id}>
        <td>{title}</td>
        <td>{price}</td>
        <td>
          <Link href={'/tickets/[ticketId]'} as={`/tickets/${id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
  ));

  return (
      <div>
        <h2>Tickets</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
          {rows}
          </tbody>
        </table>
      </div>
  );
};

/**
 * Here we are not using `useRequest` hook we created, that is because we re
 * not allowed to fetch data inside React components during the server side rendering,
 * Hence we need to use following helper props given by the Next.js to fetch some
 * initial data.
 *
 * 'getInitialProps'
 *
 * This method is specific to Next.js and uses fora async Data fetching.
 *
 * getInitialProps enables server-side rendering in a page
 * and allows you to do initial data population,
 * it means sending the page with the data already
 * populated from the server.
 * This is especially useful for SEO.
 *
 * https://nextjs.org/docs/api-reference/data-fetching/getInitialProps
 *
 * Recommended: getStaticProps or getServerSideProps
 * If you're using Next.js 9.3 or newer, we recommend that you
 * use getStaticProps or getServerSideProps instead of getInitialProps.
 *
 * These new data fetching methods allow you to have a granular
 * choice between static generation and server-side rendering.
 *
 * getInitialProps receives a single argument called context,
 * it's an object with the following properties:
 *
 * pathname - Current route. That is the path of the page in /pages
 * query    - Query string section of URL parsed as an object
 * asPath   - String of the actual path (including the query) shown in the browser
 * req      - HTTP request object (server only)
 * res      - HTTP response object (server only)
 * err      - Error object if any error is encountered during the rendering
 *
 * @returns {{}}
 */
LandingPage.getInitialProps = async (context, client, currentUser) => {
  // NOTE: Here we are receiving additional client and currentUser which passed from
  // the AppComponent.

  // // This API call happens in the Server and Browser Based on how we render the page.
  // // 1. Page refresh --> call from server
  // // 2. Paste direct url on browser and hit enter --> call from server
  // // 3. Redirect from a different page --> call on the browser.
  // // https://www.udemy.com/course/microservices-with-node-js-and-react/learn/lecture/19122254#questions/10508840
  // if (typeof window === 'undefined') {
  //   // Execute on the server.
  //
  //   // Here URL should be different as we need to access the auth service (i.e auth-srv)
  //   // through the ingress service(i.e ingress-nginx-controller) which is in a different
  //   // namespace(i.e 'ingress-nginx') than the auth-srv belonging namespace(i.e : 'default')
  //   // in kubernetes. Hence the URL should be have the format of:
  //   // http://SERVICENAME.NAMESPACENAME.svc.cluster.local/YOURROUTE
  //   //
  //   // To view the available name spaces -->
  //   // > kubectl get namespaces
  //   // To view services belong to the ingress-nginx namespace -->
  //   // > kubectl get services -n ingress-nginx
  //   //
  //   // In this case it will be:
  //   // http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuserap
  //   const response = await axios.get(
  //       'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser', {
  //         // headers: {
  //         //    Host: 'ticketing.dev', // Added this headers to by pass the nginx rules for 'host'
  //         // }
  //
  //         // Following will forward all the request headers in the current request to the
  //         // follow up request to the ingress nginx service, which will be passed to
  //         // auth service at the end. Which mainly include the Cookie and the Above Host header.
  //         headers: req.headers,
  //       }
  //   );
  //   return response.data;
  // } else {
  //   // Execute on the browser.
  //   const response = await axios.get('/api/users/currentuser');
  //   return response.data;
  // }
  // Instead of above code, following code made using above as a reusable code.

  // Since we already fetch the currentUser inside the 'AppComponent' we are not going to
  // do that again in the LandingPage as well, hence we commented the following code and
  // return an empty object.
  //
  // const client = buildClient(context);
  // const { data } = await client.get('/api/users/currentuser');
  //
  // return data;

  const { data } = await client.get('/api/tickets');

  return { tickets: data };
};


export default LandingPage;
