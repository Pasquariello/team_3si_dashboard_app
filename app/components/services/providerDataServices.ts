import type { MessageResponse } from "~/routes/settings";

export const onSave = async (provider_data: { id: number; comment?: string; provider_licensing_id: number; }): Promise<any> => {
    const {id, comment, provider_licensing_id} = provider_data
    console.log('provider_data', provider_data)
    const res = await fetch(`${process.env.VITE_API_ROOT_API_URL}/providerData/insights/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "provider_licensing_id": provider_licensing_id,
            "is_flagged": true,
            "comment": comment
        }),
    });

    // if (!res.ok) {
    //     throw new Error("Failed to fetch message");
    // }

    const data = await res.json();
    console.log('DATA ==== ', data)
    return {
        ok: res.ok,
        data
    };
}