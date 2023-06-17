import routes, {
    BASE, PAGE_404, LOGIN_PATH
} from '$wb/lib/routes';
import { storeToRefs } from 'pinia';
import { useAuthStore } from './stores';
import { createAppRouter } from '$core/utils/vue/router';

const router = createAppRouter({
    routes: routes,
    beforeEach: (to) => {
        if (PAGE_404 === to.path) {
            return;
        }
    
        if (!to.name) {
             router.push(PAGE_404);  
             return;
        }
        
        const { loggedIn } = storeToRefs(useAuthStore());
        if ((false === to.meta.needsAuth) && loggedIn.value) {
            router.push(BASE);
        } else if ((true === to.meta.needsAuth) && !loggedIn.value) {
            router.push(LOGIN_PATH);
        } 
    }
});

export default router;