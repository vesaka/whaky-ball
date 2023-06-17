export const BASE = '/';
export const SIGNUP_PATH = BASE + 'sign-up';
export const LOGIN_PATH = BASE + 'log-in';
export const PLAY_PATH = BASE + 'playground';
export const LEADERBOARD = BASE + 'leaderboard';
export const PAGE_404 = BASE + '404';
export const FORGOT_PASSWORD = BASE + 'forgot-password';
export const RESET_PASSWORD = BASE + 'reset-password';
export const TRACKS_PATH = BASE + 'tracks';
export const SUCCESS_PATH = BASE + 'success';
export const COMPLETED = BASE + 'completed';

import Home from '$wb/components/pages/Home.vue';
import Playground from '$wb/components/pages/Playground.vue';
import NotFound from '$wb/components/pages/NotFound.vue';
import Leaderboard from '$wb/components/pages/Leaderboard.vue';
import Login from '$wb/components/pages/auth/Login.vue';
import SignUp from '$wb/components/pages/auth/SignUp.vue';
import ForgotPassword from '$wb/components/pages/auth/ForgotPassword.vue';
import ResetPassword from '$wb/components/pages/auth/ResetPassword.vue';
import Tracks from '$wb/components/pages/Tracks.vue';

const routes = [
    {
        path: BASE,
        name: 'home',
        component: Home,
        meta: {
            title: 'Home'
        }
    },
    {
        path: PLAY_PATH,
        name: 'playground',
        component: Playground,
        meta: {
            title: 'Playground'
        }
    },
    {
        path: LEADERBOARD,
        name: 'leaderboard',
        component: Leaderboard,
        meta: {
            title: 'Leaderboard'
        }
    },
    {
        path: TRACKS_PATH,
        name: 'tracks',
        component: Tracks,
        meta: {
            title: 'Tracks'
        }
    },
    {
        path: LOGIN_PATH,
        name: 'login',
        component: Login,
        meta: {
            needsAuth: false,
            title: 'Log In'
        }
    },
    {
        path: SIGNUP_PATH,
        name: 'signup',
        component: SignUp,
        meta: {
            needsAuth: false,
            title: 'Sign Up'
        }
    },
    {
        path: FORGOT_PASSWORD,
        name: 'forgot-password',
        component: ForgotPassword,
        meta: {
            needsAuth: false,
            title: 'Forgot Password'
        }
    },
    {
        path: RESET_PASSWORD,
        name: 'reset-password',
        component: ResetPassword,
        meta: {
            needsAuth: false,
            title: 'Reset Password'
        }
    },
    {
        path: PAGE_404,
        name: '404',
        component: NotFound,
        meta: {
            title: '404'
        }
    }
]
    
export default routes;

