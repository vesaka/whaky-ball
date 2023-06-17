import Game3D from '$core/3d/game-main.js';
import {
    PerspectiveCamera, Clock, HemisphereLight
} from 'three';

class WhackyBallGame extends Game3D {

    constructor(options = {}) {
        super(options);

        this.$listen({
            scene: ['created'] 
        });

        this.$set('clock', new Clock);
    }
    renderer_created(renderer) {
        const camera = this.options.camera;
        this.$set('camera', new PerspectiveCamera(camera.fov, this.width / this.height, camera.near, camera.far));
        this.$emit('camera_created');
        this.camera.position.set(
            camera.position.x,
            camera.position.y,
            camera.position.z,
        );

        renderer.shadowMap.enabled = true;
        renderer.setClearColor(0x111111, 1);

        if (this.settings.controls) {
            useOrbitControls(this);
        } else {
            this.camera.lookAt(0, 250, -180);
        }

    }

    build() {
        const {
            scene, camera, renderer
        } = this;
        
        const animate = () => {
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        
        animate();
    }
}

export default WhackyBallGame;