import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import UpdatePassword from "./pages/auth/UpdatePassword";
import Layout from './components/Layout/Layout';
import { Navigate } from 'react-router-dom';
import ProductList from './pages/ProductList';
import CreateProduct from './pages/CreateProduct';
import ProductDetail from './pages/ProductDetail';

function App(){
  return (
 
      <Router>
        <Layout>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/signin" element={<SignIn/>} />
          <Route path="/signup" element={<SignUp/>} />
          <Route path="/update-password" element={<UpdatePassword/>}/>

          <Route path="/" element={<Navigate to="/product" replace />} />
          <Route path="/product" element={<ProductList />} />
          <Route path="/product/new" element={<CreateProduct />} />
          <Route path="/product/edit/:id" element={<CreateProduct />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
        </Layout>
      </Router>
  );
}

export default App;
