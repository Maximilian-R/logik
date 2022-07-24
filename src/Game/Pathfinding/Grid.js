import { MVector } from '../../Utilities/MVector';
import { GATE_COLOR, GATE_FRAME_COLOR, GRID_SIZE, WIRE_DELETE_COLOR } from '../Constants';
import { Item } from '../Electronics/Item';
import { Node } from './Node';

export class Grid {
    constructor(position) {
        this.gridWorldSize = MVector.Create(GRID_SIZE * 100, GRID_SIZE * 100);
        this.gridWorldPosition = position ? MVector.Sub(position, MVector.Div(this.gridWorldSize, 2)) : MVector.Create(0, 0);

        this.grid;
        this.path;

        this.nodeSize = MVector.Create(GRID_SIZE, GRID_SIZE);
        this.gridSize = MVector.Create(
            Math.round(this.gridWorldSize.x / this.nodeSize.x),
            Math.round(this.gridWorldSize.y / this.nodeSize.y),
        );

        this.createGrid();
    }

    nodeFromWorldPosition(position) {
        //const positionInGrid = position.div(this.nodeSize.x); does not work to divide by this.nodeSize, result is NaN?
        try {
            position = MVector.Sub(position, this.gridWorldPosition);
            return this.grid[position.x / this.nodeSize.x][position.y / this.nodeSize.y];
        } catch {
            return undefined;
        }
    }

    gridPositionFromWorldPosition(position) {
        position = MVector.Sub(position, this.gridWorldPosition);
        return MVector.Create(position.x / this.nodeSize.x, position.y / this.nodeSize.y);
    }

    worldPositionFromNode(node) {
        //MVector.Mult(node.gridPosition, this.nodeSize.x); does not work to divide by this.nodeSize, result is NaN?
        return MVector.Create(node.gridPosition.x * this.nodeSize.x, node.gridPosition.y * this.nodeSize.y).add(this.gridWorldPosition);
    }

    createGrid() {
        this.grid = Array.from(Array(this.gridSize.x), () => new Array(this.gridSize.y));

        for (let x = 0; x < this.gridSize.x; x++) {
            for (let y = 0; y < this.gridSize.y; y++) {
                this.grid[x][y] = new Node(MVector.Create(x, y));
            }
        }

        game.collisionManager.colliders
            .filter((collider) => collider.gameObject instanceof Item)
            .forEach((collider) => {
                // Offset because of rectMode(CENTER)
                const offset = MVector.Create(collider.dimension.width, collider.dimension.height).div(2);
                const leftTop = this.gridPositionFromWorldPosition(MVector.Sub(collider.position, offset));
                const rightBottom = this.gridPositionFromWorldPosition(MVector.Add(collider.position, offset));

                for (let x = Math.max(leftTop.x, 0); x <= rightBottom.x && x < this.gridSize.x; x++) {
                    for (let y = Math.max(leftTop.y, 0); y <= rightBottom.y && y < this.gridSize.y; y++) {
                        this.grid[x][y].walkable = false;
                    }
                }
            });
    }

    getNeighbours(node) {
        const neighbors = [];
        if (node.gridPosition.x < this.gridSize.x - 1) {
            neighbors.push(this.grid[node.gridPosition.x + 1][node.gridPosition.y]);
        }
        if (node.gridPosition.x > 0) {
            neighbors.push(this.grid[node.gridPosition.x - 1][node.gridPosition.y]);
        }
        if (node.gridPosition.y < this.gridSize.y - 1) {
            neighbors.push(this.grid[node.gridPosition.x][node.gridPosition.y + 1]);
        }
        if (node.gridPosition.y > 0) {
            neighbors.push(this.grid[node.gridPosition.x][node.gridPosition.y - 1]);
        }
        return neighbors;
    }

    draw() {
        const nodeSize = this.nodeSize.x;
        const ellipseSize = nodeSize / 2;
        sketch.push();
        sketch.translate(this.gridWorldPosition.x, this.gridWorldPosition.y);
        sketch.rectMode(sketch.CORNER);

        sketch.noStroke();

        sketch.fill(WIRE_DELETE_COLOR);

        for (let x = 0; x < this.gridSize.x; x++) {
            for (let y = 0; y < this.gridSize.y; y++) {
                if (!this.grid[x][y].walkable) {
                    sketch.ellipse(x * nodeSize, y * nodeSize, ellipseSize, ellipseSize);
                }
            }
        }
        sketch.fill(GATE_FRAME_COLOR);
        this.path?.forEach((node) => {
            sketch.ellipse(node.gridPosition.x * nodeSize, node.gridPosition.y * nodeSize, ellipseSize, ellipseSize);
        });

        sketch.noFill();
        sketch.stroke(GATE_COLOR);
        sketch.strokeWeight(2);
        sketch.rect(0, 0, this.gridWorldSize.x - this.nodeSize.x, this.gridWorldSize.y - this.nodeSize.y);

        sketch.fill(GATE_COLOR);
        sketch.noStroke();
        sketch.ellipse(0, 0, ellipseSize, ellipseSize);
        sketch.ellipse(0, this.gridWorldSize.y - this.nodeSize.y, ellipseSize, ellipseSize);
        sketch.ellipse(this.gridWorldSize.x - this.nodeSize.x, this.gridWorldSize.y - this.nodeSize.y, ellipseSize, ellipseSize);
        sketch.ellipse(this.gridWorldSize.x - this.nodeSize.x, 0, ellipseSize, ellipseSize);

        sketch.pop();
    }
}
