import { fixed } from '../../core/utils/math.js';

class Matrix {

    constructor(options) {
        this.width = 100;
        this.height = 100;
        this.rows = 5;
        this.columns = 5;
        this.slots = {};
        Object.assign(this, options);
        this.count = this.rows * this.columns;
        if (!this.offset) {
            this.offset = {
                x: 0,
                y: 0
            };
        }
        
        this.width -= this.offset.x * 2;
        this.height -= this.offset.y * 2;
        this.generateSlots();
        return this;
    }

    generateSlots() {
        const {rows, columns, width, height, offset} = this;
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

    eachSlot(callback) {
        const {slots} = this;
        for (let x in slots) {
            for (let y in slots[x]) {
                callback(slots[x][y], x, y);
            }
        }
    }

    firstSlot(callback) {
        const {slots} = this;
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
        const {slots} = this;
        const {x, y} = slot;
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
        const {slots} = this;
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

export default Matrix;