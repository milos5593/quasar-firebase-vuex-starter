import { AUTH, DB } from "../../boot/firebase";
import { Notify, SessionStorage } from "quasar";

export function PLACE_USER_TO_SESSION_STORAGE({ commit }, user) {
  // Save the user info in local storage
  SessionStorage.set("user", user);

  // Commit the mutation to set User state
  commit("SET_USER");
}

export function PLACE_USER_SETTINGS_TO_SESSION_STORAGE({ commit }, settings) {
  // Save the user info in local storage
  SessionStorage.set("userSettings", settings);

  // Commit the mutation to set User state
  commit("SET_USER_SETTINGS");
}

export function PLACE_USER_ROLE_TO_SESSION_STORAGE({ commit }, role) {
  // Save the user info in local storage
  SessionStorage.set("userRole", role);

  // Commit the mutation to set User state
  commit("SET_USER_ROLE");
}

export function UPDATE_USER({ commit, dispatch }, user) {
  // Save the user info in local storage
  SessionStorage.set("user", user);

  // Dispatch action to get User Settings
  dispatch("GET_USER_SETTINGS", user.uid);

  // Commit the mutation to set User state
  commit("SET_USER");
}

export function LOGIN({ dispatch }, loginInfo) {
  AUTH.signInWithEmailAndPassword(loginInfo.email, loginInfo.password)
    .then(response => {
      const { displayName, email, photoURL, uid } = response.user;
      if (uid) {
        // Save User information to Local Storage
        dispatch("PLACE_USER_TO_SESSION_STORAGE", {
          displayName,
          email,
          photoURL,
          uid
        });

        // Dispatch action to get User Settings
        dispatch("GET_USER_SETTINGS", uid).then(() =>
          // Redirect to homepage
          this.$router.replace({ name: "home" })
        );

        // Notify User that login was successfull
        Notify.create({
          color: "green-4",
          position: "top",
          textColor: "white",
          icon: "check_circle",
          message: "Login Successful"
        });
      }
    })
    .catch(err => {
      // Notify User that something went wrong
      Notify.create({
        color: "red-4",
        position: "top",
        textColor: "white",
        icon: "error",
        message: `${err.message}`
      });
    });
}

export function SIGNUP({ dispatch }, userInfo) {
  const { email, password, userSettings } = userInfo;

  AUTH.createUserWithEmailAndPassword(email, password)
    .then(response => {
      const { displayName, email, photoURL, uid } = response.user;
      if (uid) {
        DB.collection("/users")
          .doc(uid)
          .set({
            role: userSettings.role,
            settings: userSettings.settings
          })
          .then(() => {
            // Save User information to Local Storage
            dispatch("PLACE_USER_TO_SESSION_STORAGE", {
              displayName,
              email,
              photoURL,
              uid
            });
            // Dispatch action to get User Settings
            dispatch("GET_USER_SETTINGS", uid).then(() =>
              // Redirect to homepage
              this.$router.replace({
                name: "home"
              })
            );
          });
      }
    })
    .catch(err => {
      // Notify User that something went wrong
      Notify.create({
        color: "red-4",
        position: "top",
        textColor: "white",
        icon: "error",
        message: `${err.message}`
      });
    });
}

export function LOGOUT({ commit }) {
  AUTH.signOut().then(
    () => {
      // Clean Up after logout
      SessionStorage.clear();

      // Commit the mutation to set User state
      commit("SET_USER");
      commit("SET_USER_ROLE");

      // Navigate to auth page
      this.$router.replace({ name: "login" });

      // Notify User that logout was successfull
      Notify.create({
        color: "green-4",
        position: "top",
        textColor: "white",
        icon: "check_circle",
        message: "Logout Successful"
      });
    },
    err => {
      // Notify User that something went wrong
      Notify.create({
        color: "red-4",
        position: "top",
        textColor: "white",
        icon: "error",
        message: `${err.message}`
      });
    }
  );
}

export function GET_USER_SETTINGS({ dispatch }, uid) {
  let docRef = DB.collection("/users").doc(uid);

  docRef
    .get()
    .then(doc => {
      if (doc.exists) {
        dispatch("PLACE_USER_SETTINGS_TO_SESSION_STORAGE", doc.data().settings);
        dispatch("PLACE_USER_ROLE_TO_SESSION_STORAGE", doc.data().role);
      } else {
        // Notify User that something went wrong
        Notify.create({
          color: "red-4",
          position: "top",
          textColor: "white",
          icon: "error",
          message: "No such document"
        });
      }
    })
    .catch(err => {
      // Notify User that something went wrong
      Notify.create({
        color: "red-4",
        position: "top",
        textColor: "white",
        icon: "error",
        message: `${err.message}`
      });
    });
}

export function UPDATE_DISPLAY_NAME({ dispatch }, updatedName) {
  const currentUser = AUTH.currentUser;

  currentUser
    .updateProfile({
      displayName: updatedName
    })
    .then(() => {
      // Update successful.
      const { displayName, email, photoURL, uid } = currentUser;
      dispatch("UPDATE_USER", {
        displayName,
        email,
        photoURL,
        uid
      });
    })
    .catch(err => {
      // Notify User that something went wrong
      Notify.create({
        color: "red-4",
        position: "top",
        textColor: "white",
        icon: "error",
        message: `${err.message}`
      });
    });
}

export function UPDATE_THEME({ dispatch, getters }, theme) {
  const uid = getters["GET_USER_INFO"].uid;

  DB.collection("users")
    .doc(uid)
    .update({
      "settings.theme": theme
    })
    .then(function() {
      // Notify User that theme change was successfull
      Notify.create({
        color: "green-4",
        position: "top",
        textColor: "white",
        icon: "check_circle",
        message: "Theme is changed successfully"
      });
      dispatch("GET_USER_SETTINGS", uid);
    })
    .catch(err => {
      // Notify User that something went wrong
      Notify.create({
        color: "red-4",
        position: "top",
        textColor: "white",
        icon: "error",
        message: `${err.message}`
      });
    });
}
