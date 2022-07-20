import { MVector } from '../Utilities/MVector';
import { Dimension } from './Collission';
import { GRID_SIZE, GRID_SIZE_RENDER } from './Constants';

export class Grid {
    constructor() {
        this.position = MVector.Create(0, 0);
        this.dimension = new Dimension(GRID_SIZE_RENDER * 10, GRID_SIZE_RENDER * 10);
        this.render = true;
    }

    get gridSize() {
        return GRID_SIZE * 1;
    }

    move(position) {
        this.position = this.snapToGrid(position, GRID_SIZE_RENDER);
    }

    snapToGrid(position, gridSize = this.gridSize) {
        const x = sketch.floor((position.x + gridSize / 2) / gridSize) * gridSize;
        const y = sketch.floor((position.y + gridSize / 2) / gridSize) * gridSize;
        return MVector.Create(x, y);
    }

    draw() {
        if (!this.render) return;
        sketch.push();
        sketch.translate(this.position.x, this.position.y);
        sketch.noFill();
        sketch.stroke(255);
        sketch.strokeWeight(1);

        // Center grid to position
        let offsetX = -this.dimension.width / 2;
        let offsetY = -this.dimension.height / 2;
        sketch.translate(offsetX, offsetY);

        // Draw grid lines
        for (let i = GRID_SIZE_RENDER; i < this.dimension.width; i += GRID_SIZE_RENDER) {
            sketch.line(i, 0, i, this.dimension.height);
        }
        for (let j = GRID_SIZE_RENDER; j < this.dimension.height; j += GRID_SIZE_RENDER) {
            sketch.line(0, j, this.dimension.width, j);
        }

        sketch.pop();
    }
}
