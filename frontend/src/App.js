import './App.css';
//import Cart from "./components/cart/Cart";
import Layout from './components/Layout/Layout';
import { Routes, Route } from 'react-router-dom';
import ProductList from './pages/ProductList';
import CreateProduct from './pages/CreateProduct';
import ProductDetail from './pages/ProductDetail';



function App() {
  return (
    <>
    <Layout>
      <Routes>
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
