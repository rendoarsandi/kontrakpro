import type { Route } from "./+types/login";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Login - KontrakPro" }];
}

export default function Login() {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">
        Sign in to KontrakPro
      </h2>

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

        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-sm">Remember me</span>
          </label>
          <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Sign in
        </button>
      </form>

      <p className="text-center mt-6 text-sm text-gray-600">
        Don't have an account?{" "}
        <a href="/signup" className="text-blue-600 hover:underline">
          Sign up
        </a>
      </p>
    </div>
  );
}
