import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("about", "./routes/about.tsx"),
    route("dashboard", "./routes/dashboard.tsx", [
        // child routes rendered in <Outlet/>
        route("details", "./routes/details.tsx"),
        //  Example of Dynamic Routes
        route("settings/:id", "./routes/settings.tsx"),

    ]),



] satisfies RouteConfig;
