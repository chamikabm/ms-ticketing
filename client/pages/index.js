import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  console.log('Im in the component. currentUser : ', currentUser);
  return <h1>Landing Page</h1>;
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
 *
 * @returns {{}}
 */
LandingPage.getInitialProps = async () => {
  // This API call happens in the Server and Browser Based on how we render the page.
  // 1. Page refresh --> call from server
  // 2. Paste direct url on browser and hit enter --> call from server
  // 3. Redirect from a different page --> call on the browser.
  // https://www.udemy.com/course/microservices-with-node-js-and-react/learn/lecture/19122254#questions/10508840
  if (typeof window === 'undefined') {
    // Execute on the server.

    // Here URL should be different as we need to access the auth service (i.e auth-srv)
    // through the ingress service(i.e ingress-nginx-controller) which is in a different
    // namespace(i.e 'ingress-nginx') than the auth-srv belonging namespace(i.e : 'default')
    // in kubernetes. Hence the URL should be have the format of:
    // http://SERVICENAME.NAMESPACENAME.svc.cluster.local/YOURROUTE
    //
    // To view the available name spaces -->
    // > kubectl get namespaces
    // To view services belong to the ingress-nginx namespace -->
    // > kubectl get services -n ingress-nginx
    //
    // In this case it will be:
    // http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuserap
    const response = await axios.get(
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser', {
          headers: {
            Host: 'ticketing.dev', // Added this headers to by pass the nginx rules for 'host'
          }
        }
    );
    return response.data;
  } else {
    // Execute on the browser.
    const response = await axios.get('/api/users/currentuser');
    return response.data;
  }
};


export default LandingPage;
