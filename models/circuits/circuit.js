import Model from '$core/3d/models/model.js';

import { CatmullRomCurve3, Vector3 } from 'three';

class Circuit extends Model {

    createRandomCircuit(width = 480, height = 360, numPoints = 20, amplitude = 10) {
        const points = [];
        const segmentWidth = width / numPoints;
        const centerX = width / 2;
        const centerY = height / 2;

        for (let i = 0; i < numPoints; i++) {
            const x = i * segmentWidth;
            const y = centerY + (Math.random() * amplitude * 2 - amplitude);
            points.push({ x, y });
        }

        return new CatmullRomCurve3(points);
    }
}

export default Circuit;