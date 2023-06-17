import { defineStore } from 'pinia';
import { raw, extend, isObject } from '$core/utils/object.js';
import { LOADING } from '$wb/lib/constants.js';


export const useAuthStore = defineStore('$auth$', {
    state: () => ({
        user: {
            id: '',
            name: '',
            token: '',
            isGuest: true
        }
    }),
    actions: {
        login(user) {
            for (let key in this.user) {
                if (user.hasOwnProperty(key)) {
                    this.user[key] = user[key];
                }
            }            
        },
        async logout() {
            this.$reset();
        }
    },
    getters: {
        loggedIn: (state) => {
            return !!state.user.token && !state.user.isGuest;
        }
    },
    persist: {
        enabled: true,
        strategies: [
            {
                storage: localStorage,
                paths: ['user']
            }
        ]
    }
});

const initialLevel = {
    current: 1,
    start: '',
    end: '',
    secret: '',
    optimalMoves: 0,
    events: []
};

export const useGameStore = defineStore('game', {
    state: () => {
        return {
            state: LOADING,
            players: null,
            fullscreen: false,
            sound: true,
            level: raw(initialLevel),
            levels: []
        };
    },
    actions: {},
    getters: {
        gameIs(state) {
            return (status) => {
                return state.state === status;
            };
        },
        myLevels(state) {
            return state.levels.sort((a, b) => {
                return a.current - b.current;
            });
        }
    },
    persist: {
        enabled: true,
        startegies: [
            {
                key: 'game',
                storage: localStorage,
                paths: ['mode', 'players', 'sound', 'level', 'levels']
            }
        ]
    }
});

export const useErrorStore = defineStore('$errors$', {
    state: () => ({
        errors: {
            
        }
    }),
    actions: {
        update(newErrors) {
            this.errors = newErrors;
        },
        clear(name) {
            if (typeof name === 'string') {
                this.errors[name] = '';
            } else {
                this.errors = {};
            }
        }
    },
    getters: {
        first(state) {
            return name => { 
                const err = state.errors[name] || '';
                if (isObject(err)) {
                    const firstError = raw(err[Object.keys(err)[0]]);
                    return aprintf(t(`messages.${firstError.message}`, firstError.message), firstError);
                } else if (Array.isArray(err)) {
                    return err[0];
                }
                
                return err;
            };
        },
        collect(state) {
            return name => state.errors[name] || [];
        }
    }
});