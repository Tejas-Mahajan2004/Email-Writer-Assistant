import { GoogleLogin } from "@react-oauth/google";

const GoogleLoginButton = ({ onLoginSuccess }) => {
  return (
    <GoogleLogin
      onSuccess={onLoginSuccess}
      onError={() => console.log("Login Failed")}
    />
  );
};

export default GoogleLoginButton;