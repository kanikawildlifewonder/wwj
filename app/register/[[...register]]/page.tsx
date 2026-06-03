import { SignUp } from "@clerk/nextjs";

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <SignUp path="/register" routing="path" signInUrl="/login" />
    </div>
  );
}
