export class HeapItem {
    constructor() {
        this.heapIndex;
    }
    compareTo(nodeToCompare) {}
}

// Heap<T> where T: IHeapItem<T>
export class Heap {
    constructor() {
        this.items = [];
        this.currentItemCount = 0;
    }

    add(item) {
        item.heapIndex = this.currentItemCount;
        this.items[this.currentItemCount] = item;
        this.sortUp(item);
        this.currentItemCount++;
    }

    removeFirst() {
        const firstItem = this.items[0];
        this.currentItemCount--;
        this.items[0] = this.items[this.currentItemCount];
        this.items[0].heapIndex = 0;
        this.sortDown(this.items[0]);
        return firstItem;
    }

    updateItem(item) {
        this.sortUp(item);
    }

    get count() {
        return this.currentItemCount;
    }

    contains(item) {
        return this.items[item.heapIndex ?? 0] === item;
    }

    sortDown(item) {
        while (true) {
            const childIndexLeft = item.heapIndex * 2 + 1;
            const childIndexRight = item.heapIndex * 2 + 2;
            let swapIndex = 0;

            if (childIndexLeft < this.currentItemCount) {
                swapIndex = childIndexLeft;

                if (childIndexRight < this.currentItemCount) {
                    if (this.items[childIndexLeft].compareTo(this.items[childIndexRight]) < 0) {
                        swapIndex = childIndexRight;
                    }
                }

                if (item.compareTo(this.items[swapIndex]) < 0) {
                    this.swap(item, this.items[swapIndex]);
                } else {
                    return;
                }
            } else {
                return;
            }
        }
    }

    sortUp(item) {
        let parentIndex = (item.heapIndex - 1) / 2;

        while (true) {
            const parentItem = this.items[parentIndex];

            if (item.compareTo(parentItem) > 0) {
                this.swap(item, parentItem);
            } else {
                break;
            }

            parentIndex = (item.heapIndex - 1) / 2;
        }
    }

    swap(itemA, itemB) {
        this.items[itemA.heapIndex] = itemB;
        this.items[itemB.heapIndex] = itemA;
        const itemAIndex = itemA.heapIndex;
        itemA.heapIndex = itemB.heapIndex;
        itemB.heapIndex = itemAIndex;
    }
}
