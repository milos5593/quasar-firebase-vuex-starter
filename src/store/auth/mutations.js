import { SessionStorage } from "quasar";

export function SET_USER(state) {
  state.user = SessionStorage.has("user")
    ? SessionStorage.getItem("user")
    : null;
}

export function SET_USER_SETTINGS(state) {
  state.userSettings = SessionStorage.has("userSettings")
    ? SessionStorage.getItem("userSettings")
    : null;
}

export function SET_USER_ROLE(state) {
  state.role = SessionStorage.has("userRole")
    ? SessionStorage.getItem("userRole")
    : null;
}
