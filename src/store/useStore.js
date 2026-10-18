import { useSyncExternalStore } from "react";

const getSavedAuth = () => {
  try {
    return JSON.parse(localStorage.getItem("skillsacademy_auth") || "null");
  } catch {
    return null;
  }
};

const savedAuth = getSavedAuth();
if (savedAuth) {
  if (savedAuth.token && !localStorage.getItem("accessToken")) {
    localStorage.setItem("accessToken", savedAuth.token);
  }
  const rToken = savedAuth.refreshToken || savedAuth.refresh_token;
  if (rToken && !localStorage.getItem("refreshToken")) {
    localStorage.setItem("refreshToken", rToken);
  }
}

let state = {
  auth: savedAuth,
};

const listeners = new Set();

const emit = () => {
  listeners.forEach((listener) => listener());
};

export const storeActions = {
  setAuth(auth) {
    state = { ...state, auth };
    if (auth) {
      localStorage.setItem("skillsacademy_auth", JSON.stringify(auth));
      if (auth.token) {
        localStorage.setItem("accessToken", auth.token);
      }
      const rToken = auth.refreshToken || auth.refresh_token;
      if (rToken) {
        localStorage.setItem("refreshToken", rToken);
      }
    } else {
      localStorage.removeItem("skillsacademy_auth");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
    emit();
  },
  updateTokens(accessToken, refreshToken) {
    if (!state.auth) return;
    const updatedAuth = {
      ...state.auth,
      token: accessToken,
      refreshToken: refreshToken || state.auth.refreshToken || state.auth.refresh_token,
    };
    state = { ...state, auth: updatedAuth };
    localStorage.setItem("skillsacademy_auth", JSON.stringify(updatedAuth));
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    emit();
  },
  getAccessToken() {
    return localStorage.getItem("accessToken") || state.auth?.token || null;
  },
  getRefreshToken() {
    return (
      localStorage.getItem("refreshToken") ||
      state.auth?.refreshToken ||
      state.auth?.refresh_token ||
      null
    );
  },
  clearAuth() {
    state = { ...state, auth: null };
    localStorage.removeItem("skillsacademy_auth");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    emit();
  },
};

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => state;

const useStore = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

export default useStore;
