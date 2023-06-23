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

    const firstSlot = matrix.getRandomAvailableSlot();
    let opened = true;
    let currentSlot = firstSlot;

    const maxIterations = matrix.columns * 2 + (matrix.rows - 1) * 2;
    console.log(matrix.rows, matrix.rows, 'maxIterations', maxIterations);
    let iterations = 0;

    while(opened) {
        //check id current slot is at corner. Use depth as offset
        const { x, y } = currentSlot;
        const onLeftEdge = x - depth < 0;
        const onRightEdge = x + depth > matrix.columns;
        const onTopEdge = y - depth < 0;
        const onBottomEdge = y + depth > matrix.rows;

        let slots = [];
        if (onTopEdge) {
            const nextY = y + 1;
            slots = slots.concat(matrix.getSlots(
                [x - 1, nextY],
                [x, nextY],
                [x + 1, nextY],
            ));
        }

        if (onRightEdge) {
            const nextX = x + 1;
            slots = slots.concat(matrix.getSlots(
                [nextX, y - 1],
                [nextX, y],
                [nextX + 1, y + 1],
            ));
        }

        if (onBottomEdge) {
            const nextY = y - 1;
            slots = slots.concat(matrix.getSlots(
                [x - 1, nextY],
                [x, nextY],
                [x + 1, nextY],
            ));
        }

        if(onLeftEdge) {
            const nextX = x - 1;
            slots = slots.concat(matrix.getSlots(
                [nextX, y - 1],
                [nextX, y],
                [nextX, y + 1],
            ));
        }

        if(slots.length === 0) {
            console.log({currentSlot, onTopEdge, onRightEdge, onBottomEdge, onLeftEdge});
        }

        

        points.push({ x: rand(currentSlot.ax, currentSlot.bx), y: rand(currentSlot.ay, currentSlot.cy) });
        currentSlot = matrix.getRandomAvailableSlot(slots);
       // console.log(slots.length);
        slots.forEach(slot => {
            if (matrix.isSameSlot(slot, firstSlot)) {
                opened = false;
            }
        });
        
        iterations++;
        if (iterations > maxIterations) {
            break;
        }
        
    }

    console.log(points);

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


