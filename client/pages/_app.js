import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';

import Header from '../components/header';

const AppComponent =  ({ Component, pageProps, currentUser }) => {
  return (
      <div>
        <Header currentUser={currentUser} />
        <Component {...pageProps} />
      </div>
  );
};

// Data pass to the App component and to a other component bit different in the next.js
// thus, for the normal components it passes the context object including the req, res etc props.
// But for the App component it pass Component and context as ctx which includes the above
// mentioned req and res etc props.
//
// More info : https://nextjs.org/docs/advanced-features/custom-app
//
// NOTE: Also note that as soon as we add this 'getInitialProps' with the AppComponent, all the
// other 'getInitialProps' methods will not be executed automatically in other components.
// (i.e Here in singup.js --> getInitialProps will not work.)
// In such case we need to manually call the getInitialProps method as below.
AppComponent.getInitialProps = async appContext => {
  const client = buildClient(appContext.ctx); // Extract context (i.e ctx) in the appContext.
  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};
  if(appContext.Component.getInitialProps) {
    // We manually invoke the respective Component's getInitialProps method by passing
    // component's context which comes with the AppContext as ctx.
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
