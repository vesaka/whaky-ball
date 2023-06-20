import options from '../config/options.json' assert { type: "json" };
import Matrix from './matrix.js';
import path from 'path';
import fs from 'fs';
import { rand } from '../../core/utils/math.js';

const { floor } = options.models;
const filepath = path.resolve(process.cwd(), 'src/game/config/circuits.json');

const generatePoints = (width, height, numPoints, amplitude) => {
    const points = [];
    const segmentWidth = width / numPoints;
    const centerY = height / 2;

    for (let i = 0; i < numPoints; i++) {
        const x = i * segmentWidth;
        const y = centerY + (Math.random() * amplitude * 2 - amplitude);
        points.push({ x, y });
    }

    return points;
}

export const generateClosedCurvePoints = () => {
    const points = [];
    const matrix = new Matrix({
        width: floor.size.width,
        height: floor.size.height,
        rows: rand(7, 12),
        columns: rand(7, 12)
    });
    const depth = 3;
    let start = null;
    const slots = []
    matrix.eachSlot((slot, x, y) => {
        if (x >= depth && y >= depth) {
            slot.available = false;
            return;
        }

    });

    const clockwise = rand(0, 1) === 1;
    const firstSlot = matrix.getRandomAvailableSlot();
    let opened = true;
    let currentSlot = firstSlot;

    setTimeout(() => {
        opened = false;
    }, 3000);

    // while(opened) {
    //     points.push({ x: rand(currentSlot.ax, currentSlot.bx), y: rand(currentSlot.ay, currentSlot.cy) });
    //     currentSlot.available = false;
        
    // }

    console.log(firstSlot);

    return points;
}

export const createPointsSets = () => {
    const pointsSets = [];

    for (let i = 0; i < 10; i++) {
        for (let n = 10; n <= 20; n++) {
            pointsSets.push(generatePoints(floor.size.width, floor.size.height, n, 10));
        }
    }

    return pointsSets;
}

export const addSets = () => {
    const sets = createPointsSets();
    const data = getFileContent();
    data.sets = data.sets.concat(sets);
    
    save(data);
}

const getFileContent = () => {
    if (!fs.existsSync(filepath)) {
        fs.writeFileSync(filepath, JSON.stringify({
            version: '1.0.0',
            paths: [],
            amplitudes: [],
            angles: []
        }, null, 4));
    }

    return JSON.parse(fs.readFileSync(filepath));
}

const load = (data) => {
    const content = getFileContent();

    content.boards.map(board => {
        board.blocks = board.blocks.map(unserialize);

        return board;

    });

    return content.boards;
};

const save = (data) => {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 4));
}


