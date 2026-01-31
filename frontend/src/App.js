import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch  } from "react-redux";
import { useEffect } from 'react';
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import UpdatePassword from "./pages/auth/UpdatePassword";
import Layout from './components/Layout/Layout';
import ProductList from './pages/ProductList';
import CreateProduct from './pages/CreateProduct';
import ProductDetail from './pages/ProductDetail';
import Cart from './components/cart/Cart';
import { fetchCart, saveCart } from "./store/cartSlice";
import { loginSuccess } from "./store/authSlice";

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated || !user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App(){

  // send action to Redux 
  const dispatch = useDispatch();
  const { cartItems, dirty } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
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
        
        dispatch(fetchCart());
        console.log('Logi state restored from localStorage ');

      }catch(error){
        console.error('Failed to restore login state:',error);
        // if localStorage data error ,clean localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

      }
    }
  }, [dispatch]);

  useEffect(() => {
    if (token && dirty) {
     
      const timer = setTimeout(() => {
        console.log("Auto-saving cart to server...");
        dispatch(saveCart(cartItems)); 
      }, 500); 

      return () => clearTimeout(timer);
    }
  }, [cartItems, dirty, token, dispatch]);

  return (
 
      <Router>
        <Layout>
        <Cart />
        <Routes>
          {/* 公开路由：所有人都能看 */}
          <Route path="/" element={<ProductList />} />
          <Route path="/product" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          {/* 认证路由 */}
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