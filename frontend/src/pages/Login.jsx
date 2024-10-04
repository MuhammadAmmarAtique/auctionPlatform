import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/store/slices/userSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, isAuthenticated } = useSelector((state) => state.user);
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("email", email);
    formdata.append("password", password);
    dispatch(login(formdata));
  };

  useEffect(()=>{
    if (isAuthenticated === true) {
        navigateTo("/")
    }
  },[dispatch,loading,isAuthenticated])

  return (
    <>
      <form onSubmit={handleLogin}>
        <input
          autoComplete="your-email"
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />{" "}
        <br />
        <input
          autoComplete="your-current-password"
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />{" "}
        <br />
        <input type="submit" value={loading? "logging..." :"Login" } disabled={loading} />
      </form>
    </>
  );
};

export default Login;
