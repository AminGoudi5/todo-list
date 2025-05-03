import { type RouteConfig, index,route } from "@react-router/dev/routes";

export default [index("routes/home.tsx"),
    route("login", "routes/login.tsx"),
    route("panel", "routes/panel.tsx"),
    route("register", "routes/register.tsx"),
] satisfies RouteConfig;
