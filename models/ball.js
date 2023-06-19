import Model from '$core/3d/models/model.js';
import { SphereGeometry, MeshPhongMaterial, MeshBasicMaterial, Mesh, Color } from 'three';
import { Body, Sphere, Vec3, Material } from 'cannon-es';
import { colorToHex } from '$core/utils/colors';

class Ball extends Model {
    constructor(options = {}) {
        super(options);

        this.$listen({
            scene: ['render']
        });
    }

    createModel() {
        const {
            size, color
        } = this;

        const geometry = new SphereGeometry(size.radius, size.segments, size.segments);

        const material = new MeshBasicMaterial({
            color: colorToHex(color),
            wireframe: true
        });

        return new Mesh(geometry, material);
    }

    createBody() {
        const { size, physics, position } = this;
console.log(physics);
        return new Body({
            mass: physics.mass,
            shape: new Sphere(size.radius),
            position: new Vec3(position.x * 0.5, position.y * 0.5, position.z * 0.5),
            // material: new Material(physics.material),
        });
    }

    scene_render(delta) {
       //  console.log(this.body.position);
        this.update();
    }
}

export default Ball;