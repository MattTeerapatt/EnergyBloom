import RootLayout from "../layout"; // Adjust the import path based on your project structure
import AuthForm from "../auth-form";

const SignIn = () => {
  
  return (
    <div key={'sign-in'} className="flex-center size-full max-sm:px-6">
      <AuthForm type="sign-in" />
    </div>
  );
};

export default SignIn;
