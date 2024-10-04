import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideDrawer from "./layout/SideDrawer";
import { getUser } from "./store/slices/userSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Home, Signup, Login, SubmitComissionProof } from "./pages/index";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser())
  }, []);

  return (
    <Router>
      <SideDrawer /> {/* it will serve as navbar & will always appear */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/submit-commission-proof"
          element={<SubmitComissionProof />}
        />
      </Routes>
      <ToastContainer position="top-right" />{" "}
      {/* it will shows messages & will always appear */}
    </Router>
  );
}

export default App;
