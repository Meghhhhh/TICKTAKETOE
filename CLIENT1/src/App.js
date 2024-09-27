import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Topbar from "./components/Topbar";
import Home from "./components/Home";
import LandingPage from "./components/LandingPage";
import Background from "./components/Background";
import About from "./components/AboutUs";
import NotFound from "./components/NotFound";
import Footer from "./components/Footer";
import Admin from "./components/Admin";
import Contact from "./components/Contact";

function App() {
  // State to manage whether to show the landing page or home page
  const [showHomePage, setShowHomePage] = useState(false);

  // Handler to switch from landing page to home page
  const handleButtonClick = () => {
    setShowHomePage(true);
  };

  return (
    <>
      <Background />
      <Router>
        <div>
          <Topbar />
          <Routes>
            <Route
              path="/"
              element={
                showHomePage ? (
                  <Home />
                ) : (
                  <LandingPage onButtonClick={handleButtonClick} />
                )
              }
            />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Signup />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </>
  );
}

export default App;
