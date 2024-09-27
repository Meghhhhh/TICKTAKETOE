import React from "react";
import style from "../module/landing.module.css";
import Spline from "@splinetool/react-spline";

function LandingPage({ onButtonClick }) {
  return (
    <div className={style.container}>
      <div className={style.spline}>
        <Spline scene="https://prod.spline.design/rPxyYpm4BJET9B64/scene.splinecode" />
      </div>

      <h1 className={style.title}>Welcome to Tic Tech Toe</h1>
      <button onClick={onButtonClick} className={style.explorebtn}>
        Go to Home Page
      </button>
    </div>
  );
}

export default LandingPage;
