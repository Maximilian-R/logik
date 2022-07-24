import { MVector } from '../../Utilities/MVector';
import { Grid } from './Grid';
import { Heap } from './Heap';

export class PathFinding {
    constructor() {
        this.grid;
        this.debugDraw = false;
    }

    heuristic(nodeA, nodeB) {
        let distance = MVector.Dist(nodeA.gridPosition, nodeB.gridPosition);
        let curvePenalty = 0;

        if (nodeA.parent) {
            const nodes = [nodeA.parent, nodeA, nodeB];
            if (
                nodes.every((node) => node.gridPosition.x === nodes[0].gridPosition.x) ||
                nodes.every((node) => node.gridPosition.y === nodes[0].gridPosition.y)
            ) {
                curvePenalty = -0.1;
            }
        }

        return distance + curvePenalty;
    }

    retracePath(node) {
        const path = [];
        let currentNode = node;
        path.push(currentNode);

        while (currentNode.parent) {
            path.push(currentNode.parent);
            currentNode = currentNode.parent;
        }

        return this.simplifyPath(path).reverse();
    }

    findShortestPath(startPosition, targetPosition) {
        this.grid = new Grid(startPosition);

        const startNode = this.grid.nodeFromWorldPosition(startPosition);
        const targetNode = this.grid.nodeFromWorldPosition(targetPosition);
        if (!startNode || !targetNode) {
            console.log('Start or Target is outside of the pathfinding grid');
            return [];
        }

        startNode.walkable = true;
        targetNode.walkable = true;

        const openSet = new Heap();
        const closedSet = [];

        openSet.add(startNode);

        while (openSet.count > 0) {
            let currentNode = openSet.removeFirst();
            closedSet.push(currentNode);

            if (currentNode === targetNode) {
                console.log('Done');
                this.grid.path = this.retracePath(currentNode);
                return this.grid.path.map((node) => {
                    return this.grid.worldPositionFromNode(node);
                });
            }

            this.grid.getNeighbours(currentNode).forEach((neighbor) => {
                if (!neighbor.walkable || closedSet.includes(neighbor)) {
                    return;
                }

                const newMovementCostToNeighbour = currentNode.gCost + this.heuristic(currentNode, neighbor);
                if (newMovementCostToNeighbour < neighbor.gCost || !openSet.contains(neighbor)) {
                    neighbor.gCost = newMovementCostToNeighbour;
                    neighbor.hCost = this.heuristic(neighbor, targetNode);
                    neighbor.parent = currentNode;

                    if (!openSet.contains(neighbor)) {
                        openSet.add(neighbor);
                    }
                }
            });
        }

        console.log('no solution');
        return [];
    }

    /* Only keep nodes where a change of direction occurs */
    simplifyPath(path) {
        return path.reduce((previous, current, index, array) => {
            if (index >= 2) {
                const nodes = [array[index - 2], array[index - 1], array[index]];
                if (
                    nodes.every((node) => node.gridPosition.x === nodes[0].gridPosition.x) ||
                    nodes.every((node) => node.gridPosition.y === nodes[0].gridPosition.y)
                ) {
                    previous.pop();
                }
            }
            previous.push(current);
            return previous;
        }, []);
    }

    draw() {
        if (this.debugDraw) {
            this.grid?.draw();
        }
    }
}
