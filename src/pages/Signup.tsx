
import { SignupForm } from "@/components/auth/SignupForm";
import { MainLayout } from "@/components/layout/MainLayout";

const Signup = () => {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-3xl font-bold mb-8">Create Your Account</h1>
        <SignupForm />
      </div>
    </MainLayout>
  );
};

export default Signup;
