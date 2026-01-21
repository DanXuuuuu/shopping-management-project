import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import UpdatePassword from "./pages/auth/UpdatePassword";

function App(){
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn/>} />
          <Route path="/signup" element={<SignUp/>} />
          <Route path="/update-password" element={<UpdatePassword/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App;