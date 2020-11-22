import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
   return (
    <div>
      <Header currentUser={currentUser} />
      <div className='container'>
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

// getInitialProps inside custom app component is different from a page getInitProp
// arguments to custom app componenet getInitProp are {component, ctx:{req,res}} and to the page are {context} where context is {req,res}


// when we have a app level getinitprops, the component level getinitprops won't get invoked by them selves

AppComponent.getInitialProps = async appContext => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};
  if (appContext.Component.getInitialProps) {  // check if the low level component/page has getinitprop
    pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser); // pass down {req,res} to component or page level getinitprop, also pass data and client, so that we don't need to call buildClient on every page
  }

  return {
    pageProps,
    ...data
  };
};

export default AppComponent;
