import { Layout } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { Outlet, useNavigate } from 'react-router-dom';
import { ClerkProvider, useSession } from '@clerk/clerk-react';
import Root from './routes/Root';
import { useEffect } from 'react';
import { UserProvider, useUserContext } from './components/provider/UserContext';

const { Content, Footer } = Layout;

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

const App = () => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </ClerkProvider>
  );
};

const AppContent = () => {

  return (
    <Layout className="layout">
      <Header style={{position: "fixed", width: "100%", zIndex: 1}} className="font-frutiger bg-header-blue text-blue">
        <Root />
      </Header>
      <Content>
        <Outlet />
      </Content>
      <Footer  style={{position: "fixed", bottom: "0px", width: "100%"}} className='footer' >
        WissensWerk by SWM
      </Footer>
    </Layout>
  );
};

export default App;
