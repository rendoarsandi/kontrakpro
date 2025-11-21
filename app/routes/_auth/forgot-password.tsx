import type { Route } from "./+types/forgot-password";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Forgot Password - KontrakPro" }];
}

export default function ForgotPassword() {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Reset your password</h2>
      <p className="text-center text-gray-600 mb-6">
        Enter your email and we'll send you a reset link
      </p>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="you@company.com"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Send reset link
        </button>
      </form>

      <p className="text-center mt-6 text-sm text-gray-600">
        <a href="/login" className="text-blue-600 hover:underline">
          Back to login
        </a>
      </p>
    </div>
  );
}
