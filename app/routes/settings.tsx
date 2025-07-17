import { queryOptions, useQuery } from "@tanstack/react-query";
import type { Route } from "./+types/settings";
import { queryClient } from "~/queryClient";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Details" }, { name: "description", content: "Settings" }];
}

export interface MessageResponse {
  message: string;
}

export const getMessage = async (id: string): Promise<MessageResponse> => {
  const res = await fetch("");
  res.json = async () => {
    return { message: `hello ${id}` };
  };
  if (!res.ok) {
    throw new Error(`Failed to fetch message: ${res.status}`);
  }
  const message = await res.json();

  return message;
};

const messageQueryOptions = (id: string) =>
  queryOptions<MessageResponse>({
    queryKey: ["message", id],
    queryFn: () => getMessage(id),
  });

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id") ?? "";
  await queryClient.ensureQueryData(messageQueryOptions(id));
  return null;
}

export default function Settings({ params }: Route.ComponentProps) {
  const { data } = useQuery(messageQueryOptions(params.id));
  return <div>{data?.message ?? "Loading..."}</div>;
}
