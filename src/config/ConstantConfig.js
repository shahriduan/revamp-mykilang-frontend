export default class ConstantConfig {
    // Key value inside local storage
    static localStorageKey() {
        return {
            token: 'token',
            permissionStore: 'permissionStore',
            userProfile: 'userProfile',
            theme: 'theme'
        }; 
    }

    // Enum value inside table users column user_type
    static userType() {
        return {
            client: 'Client',
            hq: 'HQ'
        }
    }
}