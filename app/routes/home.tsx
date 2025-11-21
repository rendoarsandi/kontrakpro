import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "KontrakPro - Modern Contract Management Platform" },
    {
      name: "description",
      content: "AI-powered contract lifecycle management inspired by Ironclad",
    },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-6">
            KontrakPro
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Modern Contract Lifecycle Management Platform
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-12">
            Powered by React Router v7 + Cloudflare Workers
          </p>

          <div className="flex justify-center gap-4">
            <a
              href="/login"
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              Get Started
            </a>
            <a
              href="/signup"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Sign Up
            </a>
          </div>
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="p-6 border border-gray-200 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">🤖 AI-Powered</h3>
            <p className="text-gray-600">
              Intelligent contract analysis, auto-tagging, and risk assessment
            </p>
          </div>
          <div className="p-6 border border-gray-200 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">⚡ Lightning Fast</h3>
            <p className="text-gray-600">
              Built on Cloudflare's global edge network for instant performance
            </p>
          </div>
          <div className="p-6 border border-gray-200 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">🔒 Secure</h3>
            <p className="text-gray-600">
              Enterprise-grade security with RBAC and audit logging
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
