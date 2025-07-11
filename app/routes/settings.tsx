import type { Route } from "./+types/settings";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Details" },
    { name: "description", content: "Settings" },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {}

export default function Settings({
  params,
}: Route.ComponentProps) {
  return <div>Hello From settings for {params.id}</div>;
}
