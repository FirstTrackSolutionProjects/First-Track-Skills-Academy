/**
 * Dynamically loads the Razorpay checkout.js script.
 * Returns a Promise that resolves to true if loaded successfully, or false otherwise.
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      console.warn("Failed to load Razorpay SDK script from CDN");
      resolve(false);
    };

    document.body.appendChild(script);
  });
};

export default loadRazorpayScript;
