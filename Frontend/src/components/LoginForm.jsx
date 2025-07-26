import React from "react";
import InputField from "./InputField";
import Button from "./Button";


const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
  toggleForm
}) => {
  return (
    <div className="login-form-container">
      {/* Heading */}
      <h1 className="responsive-heading">Login to your account</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="login-form">
        <InputField
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputField
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Forgot Password Link */}
        <p className="forgot-password">
          <a href="#">Forgot Password?</a>
        </p>

        <Button type="submit" className="login-button">Login</Button>

        {/* Create Account Link */}
        <p className="switch-auth">
          Don’t have an account?{" "}
          <a href="#" onClick={toggleForm}>Create one</a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;

