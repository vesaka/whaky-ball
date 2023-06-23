import Container from '$core/container';

import PlaneCircuit from '$wb/models/circuits/plane-circuit.js';
import TrackCircuit from '$wb/models/circuits/track-circuit.js';
import RollerCoasterCircuit from '$wb/models/circuits/roller-coaster-circuit.js';
import { raw, extend } from '$core/utils/object';

const circuits = {
    plane: PlaneCircuit,
    track: TrackCircuit,
    rollerCoaster: RollerCoasterCircuit
};

class Level extends Container {

    constructor(options = {}) {
        super(options);
        this.gui.addFolder('Level', this.options.models);
    }

    load(level = 1, options = {}) {
        this.circuit = this.getCircuit(options);
        this.$emit('level_ready', this.circuit);
        
    }

    getCircuit(name, options = {}) {
        const { def, types } = this.options.models.circuits;
        const circuitClass = circuits[name] || Object.values(circuits)[0];
        const settings = extend(def, types[name] || {});
        return new circuitClass(extend(settings, options));
    }
}

export default Level;