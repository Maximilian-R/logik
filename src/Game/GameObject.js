import { MVector } from '../Utilities/MVector.js';
import { Serializable } from './Serializable/Serializable.js';
import { v4 as uuid } from 'uuid';

export class GameObject extends Serializable {
    constructor(position, id = uuid()) {
        super();
        this.position = position ?? MVector.Create(0, 0);
        this.collider;
        this.id = id;
        this.children = [];
        this.parent;
        this.layer = 1;
    }

    addChild(node) {
        node.id = `${this.id}:${this.children.length}`;
        this.children.push(node);
        node.parent = this;
        return node;
    }

    removeChild(node) {
        node.remove();
        this.children.splice(this.children.indexOf(node), 1);
    }

    findChild(id) {
        if (this.id === id) {
            return this;
        }
        return this.children.find((child) => child.findChild(id));
    }

    /* Converts from local to global position */
    getGlobalPosition() {
        if (this.parent != null) {
            return this.parent.getGlobalPosition().add(this.position.copy());
        }
        return this.position.copy();
    }

    removeFromParent() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }

    remove() {
        this.collider?.remove();
        this.removeAllChildren();
    }

    removeAllChildren() {
        this.children.forEach((child) => child.remove());
    }

    draw() {}
    update() {}

    // Do not override, use draw
    gameDraw() {
        sketch.push();
        sketch.translate(this.position.x, this.position.y);
        this.draw();
        this.children.forEach((child) => {
            child.gameDraw();
        });
        sketch.pop();
    }

    // Do not override, use update
    gameUpdate() {
        this.update();
        this.children.forEach((child) => {
            child.gameUpdate();
        });
    }

    serialize() {
        const json = super.serialize();
        json.id = this.id;
        json.name = 'GameObject';
        json.position = [this.position.x, this.position.y];
        return json;
    }
}
