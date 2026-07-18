const API_URL = import.meta.env.VITE_APP_API_URL;

/**
 * Submits the enrollment form data (text fields + fileData keys).
 * @param {object} payload - Form fields + fileData (no File objects, only fileKeys)
 * @returns {Promise<any>}
 */
const sendEnrollment = async (payload) => {
    const response = await fetch(`${API_URL}/courses/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const textData = await response.text();
    const data = JSON.parse(textData);
    if (!data.success) throw new Error(data.message || "Failed to submit enrollment");
    return data?.data;
};

export default sendEnrollment;
