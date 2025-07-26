import React from "react";
import InputField from "./InputField";
import Button from "./Button";

const SignUpForm = ({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  handleSubmit,
  toggleForm
}) => {
  return (
    <div className="signup-container">
      {/* Heading */}
      <h1 className="responsive-heading">Create an Account</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="signup-form">
        <InputField
          label="Full Name"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        <InputField
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button type="submit" className="signup-button">Sign Up</Button>

        {/* Back to Login Link */}
        <p className="switch-auth">
          Already have an account?{" "}
          <a href="#" onClick={toggleForm}>Login</a>
        </p>
      </form>
    </div>
  );
};

export default SignUpForm;
