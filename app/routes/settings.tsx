import { queryOptions, useQuery } from "@tanstack/react-query";
import type { Route } from "./+types/settings";
import { queryClient } from "~/queryClient";
import { objectLogger } from "~/utils/objectLogger";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Details" }, { name: "description", content: "Settings" }];
}

export interface MessageResponse {
  message: string;
}

export const getMessage = async (id: string): Promise<MessageResponse> => {
  const res = await fetch("https://127.0.0.1:3000/api/v1/databricks/live", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch message");
  }

  return res.json();
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
  const res = useQuery(messageQueryOptions(params.id));
  objectLogger(res?.data || {});
  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Key</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Value</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(res?.data || {}).map(([key, value]) => (
          <tr key={key}>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{key}</td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {typeof value === "object" && value !== null
                ? JSON.stringify(value)
                : String(value)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
