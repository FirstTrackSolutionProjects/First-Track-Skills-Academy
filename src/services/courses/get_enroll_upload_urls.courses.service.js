const API_URL = import.meta.env.VITE_APP_API_URL;

/**
 * Requests presigned S3 PUT URLs for file uploads.
 * @param {{ inputName: string, filename: string, filetype: string }[]} files
 * @returns {Promise<{ [inputName: string]: { uploadUrl: string, fileKey: string } }>}
 */
const getEnrollUploadUrls = async (files) => {
    const response = await fetch(`${API_URL}/courses/enroll/upload-urls`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files }),
    });
    const textData = await response.text();
    const data = JSON.parse(textData);
    if (!data.success) throw new Error(data.message || "Failed to get upload URLs");
    return data.data;
};

export default getEnrollUploadUrls;
