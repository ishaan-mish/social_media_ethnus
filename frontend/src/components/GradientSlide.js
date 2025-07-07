import React from "react";
import "../cssStyles/styles.css";
import iceImg from "../assets/ice.jpg";

function GradientSlide({ isShifted }) {
  return (
    <div
      className={`gradientSlide ${isShifted ? "shiftLeft" : ""}`}
      id="gradientSlide"
    >
      <img src={iceImg} alt="Logo" />
      <div>
        <h2 style={{ fontFamily: "Crutsen" }}>Social-Media</h2>
      </div>
      <span className="loginText">SignUp</span>
      <span className="signupText">Login</span>
    </div>
  );
}

export default GradientSlide;