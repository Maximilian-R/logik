import { HeapItem } from './Heap';

export class Node extends HeapItem {
    constructor(position, walkable = true) {
        super();
        this.gridPosition = position;
        this.walkable = walkable;

        this.gCost = 0; // distance to start
        this.hCost = 0; // distance to target

        this.parent;
    }

    get fCost() {
        return this.gCost + this.hCost;
    }

    compareTo(nodeToCompare) {
        let compare = this.fCost === (nodeToCompare?.fCost ?? 0) ? 0 : this.fCost > (nodeToCompare?.fCost ?? 0) ? 1 : -1;
        if (compare === 0) {
            compare = this.hCost === (nodeToCompare?.hCost ?? 0) ? 0 : this.hCost > (nodeToCompare?.hCost ?? 0) ? 1 : -1;
        }
        return -compare;
    }
}
