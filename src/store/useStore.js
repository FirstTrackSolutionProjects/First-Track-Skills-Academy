import { useSyncExternalStore } from "react";

const savedAuth = JSON.parse(localStorage.getItem("skillsacademy_auth") || "null");

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
    localStorage.setItem("skillsacademy_auth", JSON.stringify(auth));
    localStorage.setItem("accessToken", auth.token);
    emit();
  },
  clearAuth() {
    state = { ...state, auth: null };
    localStorage.removeItem("skillsacademy_auth");
    localStorage.removeItem("accessToken");
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
