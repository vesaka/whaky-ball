import Game3D from '$core/3d/game-base.js';
import {
    PerspectiveCamera, Clock, HemisphereLight,
    AxesHelper, PlaneHelper, GridHelper,
} from 'three';
import { GSSolver, SAPBroadphase, World, Material, ContactMaterial } from 'cannon-es';

import Ball from '$wb/models/ball';
import Floor from '$wb/models/floor';
import Circuit from '$wb/models/circuits/circuit';
import Level from '$wb/system/level';
import GUI from 'lil-gui';
import { useOrbitControls } from '$core/3d/mixins/orbit-controls-mixin.js';
import { raw } from '$core/utils/object';

class WhackyBallGame extends Game3D {

    constructor(options = {}) {
        super(options);

        this.$listen({
            scene: ['created'],
            level: ['ready'] 
        });

        this.$set('clock', new Clock);
        
        this.createWorld();
        this.createModels();
        this.createHelers();

        this.$set('level', new Level);
    }

    createWorld() {
        const world = raw(this.options.world);
        const defaultMaterial = new Material('default');
        const defaultContactMaterial = new ContactMaterial(
            defaultMaterial,
            defaultMaterial,
            {
                friction: 0.0,
                restitution: 0.7
            }
        )

        world.solver = new GSSolver(world.solver);
        this.world = new World(world);
        this.world.broadphase = new SAPBroadphase(this.world);
        this.world.defaultContactMaterial = defaultContactMaterial;
    }

    createModels() {
        const { ball, floor } = this.options.models;

        const $ball = new Ball(ball);
        const $floor = new Floor(floor);

        this.add($floor, $ball);
        //this.$set('ball', new Ball(ball));
    }

    createHelers() {
        const axesHelper = new AxesHelper(100);
        this.scene.add(axesHelper);
    }

    renderer_created(renderer) {
        const camera = this.options.camera;
        this.$set('camera', new PerspectiveCamera(camera.fov, this.width / this.height, camera.near, camera.far));
        this.$emit('camera_created');

        if (this.settings.controls) {
            useOrbitControls(this);
            this.controls.autoRotate = false;
            this.controls.target.applyAxisAngle(this.camera.up, Math.PI / 2);
            this.camera.position.applyAxisAngle(this.camera.up, Math.PI / 2);
        }

        this.camera.position.set(
            camera.position.x,
            camera.position.y,
            camera.position.z,
        );

        this.camera.rotation.set(
            camera.rotation.x,
            camera.rotation.y,
            camera.rotation.z,
        );

        this.$set('gui', new GUI);
        this.gui.add(this.camera.position, 'x', -1000, 1000, 10);
        this.gui.add(this.camera.position, 'y', -1000, 1000, 10);
        this.gui.add(this.camera.position, 'z', -1000, 1000, 10);
        this.gui.add(this.camera.rotation, 'x', -Math.PI, Math.PI, 0.01);
        this.gui.add(this.camera.rotation, 'y', -Math.PI, Math.PI, 0.01);
        this.gui.add(this.camera.rotation, 'z', -Math.PI, Math.PI, 0.01);
            // this.gui.onChange(() => {
            //     console.log(this.camera.position)
            // })

        renderer.shadowMap.enabled = true;
        renderer.setClearColor(0x111111, 1);

        

    }

    level_ready(circiut) {
        this.add(circiut);
    }

    build() {
        const {
            scene, camera, renderer, world, clock, settings, level
        } = this;
        
        const timeStep = 1 / settings.fps;

        this.level.load();
        const animate = (delta) => {
            renderer.render(scene, camera);
            this.$emit('scene_render', delta);
            world.step(timeStep, delta, 10);
            // if(settings.controls) {
            //     this.controls.update();
            // }
            requestAnimationFrame(animate);
        };
        
        animate();
    }
}

export default WhackyBallGame;