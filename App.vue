<template>
<RouterView v-slot="{ Component }" v-if="ready">
    <transition
             :enter-active-class="animate.enterActive"
             :enter-from-class="animate.enterFrom"
             :enter-to-class="animate.enterTo"
             :leave-active-class="animate.leaveActive"
             :leave-from-class="animate.leaveFrom"
             :leave-to-class="animate.leaveTo">
            <component :is="Component" />
        </transition>
</RouterView>
</template>
<script setup>
import { computed, ref } from 'vue';
import { setLocales } from '$core/utils/i18n';
import { useAuthStore } from '$wb/lib/stores';
import api from '$wb/lib/api.js';
import en from '$wb/assets/i18n/en.json';
import env from '$wb/lib/imports.js';
import { tween } from '$wb/utils/tw/transitions';

const animate = computed(() => {
    return tween('slide');
});

let ready = ref(false);
const auth = useAuthStore();

setTimeout(() => {
    ready.value = true;
}, 300);
setLocales({ en });
</script>