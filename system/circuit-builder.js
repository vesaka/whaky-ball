import { fixed, rand } from '$core/utils/math.js';

class CircuitBuilder {

    constructor(width = 100, height = 100, rows = 5, columns = 5, offset = null) {
        this.width = width;
        this.height = height;
        this.rows = rows;
        this.columns = columns;
        this.slots = {};

        this.count = rows * columns;
        this.offset = offset || { x: 0, y: 0 };
        this.depth = Math.floor(Math.min(rows, columns) / 2);


        this.width -= this.offset.x * 2;
        this.height -= this.offset.y * 2;
        this.createSlots();
        return this;
    }

    createSlots() {
        const { rows, columns, width, height, offset } = this;
        const cellWidth = fixed(width / columns, 2);
        const cellHeight = fixed(height / rows, 2);

        for (let x = 0; x < rows; x++) {
            if (!this.slots[x]) {
                this.slots[x] = {};
            }

            for (let y = 0; y < columns; y++) {
                this.slots[x][y] = {
                    x, y,
                    ax: offset.x + fixed(y * cellWidth, 2), ay: offset.y + fixed(x * cellHeight, 2),
                    bx: offset.x + fixed((y + 1) * cellWidth, 2), by: offset.y + fixed(x * cellHeight, 2),
                    cx: offset.x + fixed(y * cellWidth, 2), cy: offset.y + fixed((x + 1) * cellHeight, 2),
                    dx: offset.x + fixed((y + 1) * cellWidth, 2), dy: offset.y + fixed((x + 1) * cellHeight, 2),
                    width: cellWidth,
                    height: cellHeight,
                    available: true,
                };
            }
        }
    }

    createPoints() {
        const { depth, rows, columns } = this;
        const points = [];
        this.eachSlot((slot, x, y) => {
            if (x >= depth && y >= depth) {
                slot.available = false;
                return;
            }
        });

        const firstSlot = this.getRandomAvailableSlot();
        let opened = true;
        let currentSlot = firstSlot;

        const maxIterations = columns * 2 + (rows - 1) * 2;
        let iterations = 0;

        while (opened) {
            //check id current slot is at corner. Use depth as offset
            const { x, y } = currentSlot;
            const onLeftEdge = x - depth < 0;
            const onRightEdge = x + depth > columns;
            const onTopEdge = y - depth < 0;
            const onBottomEdge = y + depth > rows;

            let slots = [];
            if (onTopEdge) {
                const nextY = y + 1;
                slots = slots.concat(this.getSlots(
                    [x - 1, nextY],
                    [x, nextY],
                    [x + 1, nextY],
                ));
            }

            if (onRightEdge) {
                const nextX = x + 1;
                slots = slots.concat(this.getSlots(
                    [nextX, y - 1],
                    [nextX, y],
                    [nextX + 1, y + 1],
                ));
            }

            if (onBottomEdge) {
                const nextY = y - 1;
                slots = slots.concat(this.getSlots(
                    [x - 1, nextY],
                    [x, nextY],
                    [x + 1, nextY],
                ));
            }

            if (onLeftEdge) {
                const nextX = x - 1;
                slots = slots.concat(this.getSlots(
                    [nextX, y - 1],
                    [nextX, y],
                    [nextX, y + 1],
                ));
            }

            points.push({ x: rand(currentSlot.ax, currentSlot.bx), y: rand(currentSlot.ay, currentSlot.cy) });
            currentSlot = this.getRandomAvailableSlot(slots);
    
            slots.forEach(slot => {
                if (this.isSameSlot(slot, firstSlot)) {
                    opened = false;
                }
            });
            
            iterations++;
            if (iterations > maxIterations) {
                break;
            }
        }


        return points;
    }

    createAmplitudes() { }

    createAngles() { }

    eachSlot(callback) {
        const { slots } = this;
        for (let x in slots) {
            for (let y in slots[x]) {
                callback(slots[x][y], x, y);
            }
        }
    }

    firstSlot(callback) {
        const { slots } = this;
        let result;

        for (let x in slots) {
            for (let y in slots[x]) {
                result = callback(slots[x][y]);
                if (true === result) {
                    return slots[x][y];
                }
            }
        }

        return null;
    }

    getRandomAvailableSlot() {
        const freeSlots = [];
        this.eachSlot((slot) => {
            if (true === slot.available) {
                freeSlots.push(slot);
            }
        });
        return freeSlots[Math.floor(Math.random() * freeSlots.length)];
    }

    getAvailableAdjacentSlots(slot) {
        const { slots } = this;
        const { x, y } = slot;
        const adjacentSlots = [];
        const checkSlot = (x, y) => {
            if (slots[x] && slots[x][y] && true === slots[x][y].available) {
                adjacentSlots.push(slots[x][y]);
            }
        }

        checkSlot(x - 1, y);
        checkSlot(x + 1, y);
        checkSlot(x, y - 1);
        checkSlot(x, y + 1);

        return adjacentSlots;
    }

    getRandomAdjacentAvailableSlot(slot, clockwise = true) {
        const adjacentSlots = this.getAvailableAdjacentSlots(slot);
        return adjacentSlots[Math.floor(Math.random() * adjacentSlots.length)];
    }

    isSameSlot(slotA, slotB) {
        return slotA.x === slotB.x && slotA.y === slotB.y;
    }


    getSlots(...points) {
        const { slots } = this;
        const result = [];
        for (let i = 0; i < points.length; i++) {
            const [x, y] = points[i];
            if (slots[x] && slots[x][y] && slots[x][y].available) {
                result.push(slots[x][y]);
            }
        }
        return result;

    }

}

export default CircuitBuilder;