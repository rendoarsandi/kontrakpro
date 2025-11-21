import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

  // Auth routes
  layout("routes/_auth/layout.tsx", [
    route("login", "routes/_auth/login.tsx"),
    route("signup", "routes/_auth/signup.tsx"),
    route("forgot-password", "routes/_auth/forgot-password.tsx"),
  ]),

  // Dashboard routes (protected)
  layout("routes/_dashboard/layout.tsx", [
    route("dashboard", "routes/_dashboard/index.tsx"),

    // Contracts
    ...prefix("contracts", [
      index("routes/_dashboard/contracts/index.tsx"),
      route("new", "routes/_dashboard/contracts/new.tsx"),
      route(":id", "routes/_dashboard/contracts/$id.tsx"),
      route(":id/edit", "routes/_dashboard/contracts/$id.edit.tsx"),
    ]),

    // Workflows
    ...prefix("workflows", [
      index("routes/_dashboard/workflows/index.tsx"),
      route("new", "routes/_dashboard/workflows/new.tsx"),
      route(":id", "routes/_dashboard/workflows/$id.tsx"),
    ]),

    // Templates
    ...prefix("templates", [
      index("routes/_dashboard/templates/index.tsx"),
      route("new", "routes/_dashboard/templates/new.tsx"),
      route(":id", "routes/_dashboard/templates/$id.tsx"),
    ]),

    // Analytics
    route("analytics", "routes/_dashboard/analytics.tsx"),

    // Settings
    route("settings", "routes/_dashboard/settings.tsx"),
  ]),

  // API routes
  ...prefix("api", [
    route("contracts", "routes/api/contracts.ts"),
    route("workflows", "routes/api/workflows.ts"),
    route("ai/analyze", "routes/api/ai/analyze.ts"),
    route("webhooks/:provider", "routes/api/webhooks/$provider.ts"),
  ]),
] satisfies RouteConfig;
