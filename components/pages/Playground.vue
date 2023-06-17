<template>
    <div id="gameScreen" class="flex relative inset w-full">
        <canvas ref="canvas" class="flex fixed inset-0 -z-20" style="left: 0; right: 0;"></canvas>
        <div class="flex flex-row w-full"></div>
    </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import WhackyBallGame from '$wb/whacky-ball-game';
import ResizeMixin from '$core/3d/mixins/resize-mixin.js';
import StatesMixin from '$core/mixins/states-mixin.js';

import options from '$wb/config/options.json';
import settings from '$wb/config/settings.json';
import assets from '$wb/config/assets.json';

import { useGameStore, useAuthStore } from '$wb/lib/stores.js';

const store = useGameStore();
const router = useRouter();
const route = useRoute();
const canvas = ref(null);
let game = null;

onMounted(() => {
        game = new WhackyBallGame({
            canvas: canvas.value,
            options, settings, assets,
            $store: store,
            $auth: useAuthStore(),
            mixins: [ResizeMixin, StatesMixin]
        });
        game.load();        
    });

    onBeforeUnmount(() => {
        if (store.gameIs('playing')) {
            game.$emit('game_over');
        }
        game.destroy();
        game = null;

    });
</script>
