export const onSave = async (provider_data: { id: number; comment?: string; provider_licensing_id: number; is_flagged: boolean }): Promise<any> => {
    const { id, comment, provider_licensing_id, is_flagged } = provider_data
    const res = await fetch(`${process.env.VITE_API_ROOT_API_URL}/providerData/insights/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "provider_licensing_id": provider_licensing_id,
            "is_flagged": is_flagged,
            "comment": comment
        }),
    });

    const data = await res.json();
    return {
        ok: res.ok,
        data
    };
}