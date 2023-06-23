import Model from '$core/3d/models/model.js';
import CircuitBuilder from '$wb/system/circuit-builder.js';
import { CatmullRomCurve3, Vector3 } from 'three';
import { Body, Shape, Vec3, Box, Trimesh } from 'cannon-es';

class Circuit extends Model {

    constructor(options = {}) {
        
        super(options);
    }

    createRandomCircuit() {
        const points = this.points.map(point => new Vector3(point.x, point.y, 0));
        return new CatmullRomCurve3(points);
    }

    createPoints() {
        const {width, height, depth} = this;
        const builder = new CircuitBuilder();
        return builder.createPoints();
    }

    getPoints() {
        if (!this.points) {
            const builder = new CircuitBuilder();
            this.points = builder.createPoints();
        }

        return this.points;
    }

    createBody() {
        return new Body({
            mass: 0,
            type: Body.STATIC,
            allowSleep: true,
            shape: new Box(new Vec3(1, 1, 1)),
            position: new Vec3(0, 0, 0)
        });
        return new Body({
            mass: 0,
            position: new Vec3(0, 0, 0),
            shape: new Shape({
                type: Shape.types.TRIMESH,
                vertices: this.points,
                indices: this.builder.createIndices(this.points.length),
                edges: this.builder.createEdges(this.points.length)
            })
        });
    }
}

export default Circuit;