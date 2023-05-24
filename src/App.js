import React, { Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import "./App.css";
import Home from "./pages/home/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserList from "./pages/userList/UserList";
import User from "./pages/user/User";
import NewUser from "./pages/newUser/NewUser";
import ProductList from "./pages/productList/ProductList";
import Product from "./pages/product/Product";
import NewProduct from "./pages/newProduct/NewProduct";
import Login from "./pages/login/Login";
import Sales from "./pages/sales/Sales";
import OrderList from "./pages/orderList/OrderList";
import { getMessages, getOrders, getProducts, getUsers } from "./redux/apiCalls";
import Order from "./pages/order/Order";
import MessageList from "./pages/messageList/MessageList";
import Message from "./pages/message/Message";
import { useEffect } from "react";


const App = () => {
  const dispatch = useDispatch();
  const user = !!useSelector(state => state.user.currentUser);

  useEffect(() => {
    let ignore = false;
    if (!ignore && user) {
      getMessages(dispatch);
      getProducts(dispatch);
      getOrders(dispatch);
      getUsers(dispatch);
    }
    return () => ignore = true;
  }, [dispatch, user]);

  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <Topbar />
        <div className="container">
          {user && <Sidebar />}
          <Routes>
            <Route path="/login" element={user ? <Home /> : <Login />} />
            {user && (
              <>
                  <Route exact path="/" element={<Home />} />
                  <Route path="/orders" element={<OrderList />} />
                  <Route path="/order/:orderId" element={<Order />} />
                  <Route path="/users" element={<UserList />} />
                  <Route path="/user/:userId" element={<User />} />
                  <Route path="/newUser" element={<NewUser />} />
                  <Route path="/products" element={<ProductList />} />
                  <Route path="/product/:productId" element={<Product />} />
                  <Route path="/newproduct" element={<NewProduct />} />
                  <Route path="/sales" element={<Sales />} />
                  <Route path="/messages" element={<MessageList />} />
                  <Route path="/message/:messageId" element={<Message />} />
              </>
            )}
          </Routes>
        </div>
      </Router>
    </Suspense>
  );
}

export default App;