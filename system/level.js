import Container from '$core/container';

import PlaneCircuit from '$wb/models/plane-circuit.js';
import TrackCircuit from '$wb/models/track-circuit.js';
import RollerCoasterCircuit from '$wb/models/roller-coaster-circuit.js';

const circuits = {
    plane: PlaneCircuit,
    track: TrackCircuit,
    rollerCoaster: RollerCoasterCircuit
};

class Level extends Container {

    load(level = 1) {

    }

    getCircuit(name, options = {}) {
        const circuitClass = circuits[name] || Object.values(circuits)[0];
        return new circuitClass(options);
    }
}

export default Level;