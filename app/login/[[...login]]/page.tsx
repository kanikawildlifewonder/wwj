import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <SignIn path="/login" routing="path" signUpUrl="/register" />
    </div>
  );
}
