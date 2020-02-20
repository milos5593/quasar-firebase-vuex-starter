export function GET_USER_INFO (state) {
    return state.user
}
export function GET_ROLE (state) {
    return state.role
}

export function GET_USER_SETTINGS (state) {
    return state.userSettings;
}

export function IS_LOGGED_IN (state) {
    return state.user !== null ? true : false
}