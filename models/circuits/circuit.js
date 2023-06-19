import Model from '$core/3d/models/model.js';

import { CatmullRomCurve3, Vector3 } from 'three';

class Circuit extends Model {

    createRandomCircuit() {
        const points = [];
        const numPoints = 10;
        const radius = 10;
        const height = 10;

        for (let i = 0; i < numPoints; i++) {
            points.push(new Vector3(
                Math.sin(i * 0.2) * radius,
                (Math.cos(i * 0.2) + 1) * height,
                (i - numPoints * 0.5) * 0.2
            ));
        }

        return new CatmullRomCurve3(points);
    }
}

export default Circuit;