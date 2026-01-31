import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import UpdatePassword from "./pages/auth/UpdatePassword";
import Layout from './components/Layout/Layout';
import { useDispatch  } from "react-redux";
import { loginSuccess } from "./store/slices/authSlice";
import './App.css';
//import Cart from "./components/cart/Cart";
import Layout from './components/Layout/Layout';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProductList from './pages/ProductList';
import CreateProduct from './pages/CreateProduct';
import ProductDetail from './pages/ProductDetail';



function App(){
  // send action to Redux 
  const dispatch = useDispatch();
  // reloading the login state from localStorage 
  useEffect(()=>{
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if(token && userStr){
      try{
        const user = JSON.parse(userStr);
        dispatch(loginSuccess({
          user: user,
          token: token
        }));
        console.log('Logi state restored from localStorage ');

      }catch(error){
        console.error('Failed to restore login state:',error);
        // if localStorage data error ,clean localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

      }
    }
  }, [dispatch]);
  return (
 
      <Router>
        <Layout>
        <Routes>
          <Route path="/" element={<div>Welcome to E-Commerce platform</div>} />
          <Route path="/signin" element={<SignIn/>} />
          <Route path="/signup" element={<SignUp/>} />
          <Route path="/update-password" element={<UpdatePassword/>}/>
        </Routes>
         </Layout>
      </Router>
    <>
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/product" replace />} />
        <Route path="/product" element={<ProductList />} />
        <Route path="/product/new" element={<CreateProduct />} />
        <Route path="/product/edit/:id" element={<CreateProduct />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </Layout>
    </>
  );
}

export default App;
