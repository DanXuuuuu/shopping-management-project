import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector  } from "react-redux";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import UpdatePassword from "./pages/auth/UpdatePassword";
import Layout from './components/Layout/Layout';
import ProductList from './pages/ProductList';
import CreateProduct from './pages/CreateProduct';
import ProductDetail from './pages/ProductDetail';
import Cart from './components/cart/Cart';


const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated || !user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App(){
  
  return (
 
      <Router>
        <Layout>
        <Cart />
        <Routes>
          {/* Public Route: all person could see */}
          <Route path="/" element={<ProductList />} />
          <Route path="/product" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          {/* Auth Route */}
          <Route path="/signin" element={<SignIn/>} />
          <Route path="/signup" element={<SignUp/>} />
          <Route path="/update-password" element={<UpdatePassword/>}/>


          {/* 保护路由：只有 Admin 能进  */}
          {/* 如果普通用户在地址栏硬输 /product/new，会被 AdminRoute 拦截 */}
          <Route 
            path="/product/new" 
            element={
              <AdminRoute>
                <CreateProduct />
              </AdminRoute>
            } 
          />
          <Route 
            path="/product/edit/:id" 
            element={
              <AdminRoute>
                <CreateProduct />
              </AdminRoute>
            } 
          />
          
        </Routes>
        </Layout>
      </Router>
  );
}

export default App;