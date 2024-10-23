import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideDrawer from "./layout/SideDrawer";
import { getUser,fetchLeaderboard  } from "./store/slices/userSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAllAuctionItems } from "./store/slices/auctionSlice"

import { 
  Home,
  Signup,
  Login,
  SubmitComissionProof,
  HowItWorks,
  About,
  Leaderboard,
  Auctions,
  AuctionItem,
  CreateAuction,
  ViewMyAuctions,
  Dashboard,
  Contact
} from "./pages/index";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
    dispatch(getAllAuctionItems())
    dispatch(fetchLeaderboard())
  }, []);

  return (
    <Router>
      <SideDrawer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/submit-commission-proof"
          element={<SubmitComissionProof />}
        />
        <Route path="/how-it-works-info" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/auctions" element={<Auctions />} />
        <Route path="/auction/item/:id" element={<AuctionItem />} />
        <Route path="/create-auction" element={<CreateAuction />} />
        <Route path="/view-my-auctions" element={<ViewMyAuctions />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/contact" element={<Contact />} /> 
      </Routes>
      <ToastContainer position="top-right" />{" "}
    </Router>
  );
}

export default App;
