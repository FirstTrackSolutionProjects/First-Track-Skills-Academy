const API_URL = import.meta.env.VITE_APP_BACKEND_URL;

const sendContactUs = async (payload) => {
    const response = await fetch(`${API_URL}/contacts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
    })
    const textData = await response.text();
    const data = JSON.parse(textData);
    if (!data.success) throw new Error(data.message || "Something Went Wrong!")
    return data?.data;
}

export default sendContactUs;
