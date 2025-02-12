import { useState } from 'react';
import './App.css';
import LoginPage from './page/LoginPage';
import ProductPage from './page/ProductPage';

function App() {
  const [isAuth, setIsAuth] = useState(false);
  

  return (
    <>
      {isAuth ? (
        <ProductPage setIsAuth={setIsAuth}/>
      ) : (
        <LoginPage setIsAuth={setIsAuth} />
      )}
    </>
  );
}

export default App;
