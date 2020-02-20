import { SessionStorage } from "quasar";

export default {
  user: getSavedState("user"),
  userSettings: getSavedTheme("userSettings"),
  role: getSavedState("userRole")
};

function getSavedState(local_storage_name) {
  return SessionStorage.has(local_storage_name)
    ? SessionStorage.getItem(local_storage_name)
    : null;
}

function getSavedTheme(local_storage_name) {
  return SessionStorage.has(local_storage_name)
    ? SessionStorage.getItem(local_storage_name)
    : "light";
}
