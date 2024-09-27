import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SideDrawer from "./layout/SideDrawer";
import Home from "./pages/home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <SideDrawer />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <ToastContainer position="top-right" />
    </Router>
  );
}

export default App;
