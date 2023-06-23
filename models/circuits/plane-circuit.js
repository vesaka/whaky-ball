import Circuit from './circuit';

import {
    CatmullRomCurve3, Vector3, Vector2, Shape,
    ExtrudeGeometry, MeshBasicMaterial, Mesh
} from 'three';

class PlaneCircuit extends Circuit {

    constructor(options = {}) {

        super(options);

    }

    createModel() {
        const { extrude } = this;
        const amplitude = this.amplitude || 0;
        const points = this.getPoints().map(({ x, y }) => new Vector3(x, y, amplitude));

        const path = new CatmullRomCurve3(points);
        path.curveType = 'catmullrom';
        extrude.extrudePath = path;

        const pts1 = [
            new Vector2(0, 0),
            new Vector2(10, 0),
            new Vector2(10, 10),
            new Vector2(0, 10)
        ];


        const shape = new Shape(pts1);
        const geometry = new ExtrudeGeometry(shape, extrude);
        const material = new MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
        const mesh = new Mesh(geometry, material);


        return mesh;
    }
}

export default PlaneCircuit;