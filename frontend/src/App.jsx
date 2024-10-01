import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideDrawer from "./layout/SideDrawer";
import Home from "./pages/home";
import Signup from "./pages/Signup";

function App() {
  return (
    <Router>
     <SideDrawer />  {/* it will serve as navbar & will always appear */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<Signup />} />
      </Routes>
      <ToastContainer position="top-right" /> {/* it will shows messages & will always appear */}
    </Router>
  );
}

export default App;
