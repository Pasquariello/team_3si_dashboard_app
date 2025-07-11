import type { Route } from "./+types/details";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Details" },
    { name: "description", content: "Details" },
  ];
}

export default function Details() {
  return <div>Hello From Details</div>;
}
