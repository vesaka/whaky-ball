import Model from '$core/3d/models/model.js';

import { PlaneGeometry, MeshBasicMaterial, Mesh } from 'three';
import { Plane, Body, Box, Material, Vec3 } from 'cannon-es';
import { colorToHex } from '$core/utils/colors';
class Floor extends Model {

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

        const geometry = new PlaneGeometry(size.width, size.height, 4, 5);
        const material = new MeshBasicMaterial({
             color: colorToHex(color),
             wireframe: true
        });

        return new Mesh(geometry, material);
    }

    createBody() {
        const { position, size } = this;
        const plane = new Plane;

        return new Body({
            mass: 0,
            shape: new Box(new Vec3(size.width, size.height, 1)),
            position: new Vec3(position.x, position.y, position.z),
        });
    }

    scene_render() {
        const { body, model } = this;
        model.position.copy(body.position);
        model.quaternion.copy(body.quaternion);
    }
}

export default Floor;