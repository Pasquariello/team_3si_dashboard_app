import type { Route } from "./+types/dashboard";
import { Outlet } from "react-router";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard" },
    { name: "description", content: "Dashboard" },
  ];
}

export default function Dashboard() {
    return (
        <div>
            Hello From Dashboard
            <Outlet />
        </div>
    )
}
