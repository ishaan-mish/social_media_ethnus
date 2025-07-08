import React, { useState } from 'react';
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
    {isShifted ? (
      <SignupForm shiftContainer={shiftContainer} />
    ) : (
      <LoginForm shiftContainer={shiftContainer} />
    )}
  </div>
);

}

export default AuthScreen;