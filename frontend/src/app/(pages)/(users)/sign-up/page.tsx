import AuthForm from "../auth-form";
import RootLayout from "../layout";

const SignUp = async () => {
  return (
    <div key={'sign-up'} className="flex-center size-full max-sm:px-6">
      <AuthForm type="sign-up" />
    </div>
  );
};

export default SignUp;