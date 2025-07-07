import React, { useState } from 'react';
import GradientSlide from '../components/GradientSlide';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import '../cssStyles/styles.css';

function AuthScreen() {
  const [isShifted, setIsShifted] = useState(false);

  const shiftContainer = () => {
    setIsShifted(!isShifted);
  };

return (
  <div className="authContainer">
    <GradientSlide isShifted={isShifted} />
    {isShifted ? (
      <SignupForm shiftContainer={shiftContainer} />
    ) : (
      <LoginForm shiftContainer={shiftContainer} />
    )}
  </div>
);

}

export default AuthScreen;