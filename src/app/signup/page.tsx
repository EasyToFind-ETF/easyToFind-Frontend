import { SignUpForm } from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-4">
      <div className="hidden items-start justify-center pt-20 lg:flex">
        <h1 className="text-4xl font-bold">회원가입</h1>
      </div>
      <div className="flex items-center justify-center bg-white p-6 lg:col-span-2">
        <SignUpForm />
      </div>
      <div className="bg-white"></div>
    </div>
  );
}
