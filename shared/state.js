// State Management - StatAnalyzer Pro
class StateManagerClass {
    constructor() {
        this.state = {};
        this.listeners = {};
    }

    get(key) {
        return this.state[key];
    }

    set(key, value) {
        this.state[key] = value;
        this.emit(key, value);
    }

    on(key, callback) {
        if (!this.listeners[key]) this.listeners[key] = [];
        this.listeners[key].push(callback);
    }

    emit(key, value) {
        if (this.listeners[key]) {
            this.listeners[key].forEach(cb => cb(value));
        }
    }

    clear() {
        this.state = {};
        this.listeners = {};
    }
}

export const StateManagerApp = new StateManagerClass();
export default StateManagerApp;
