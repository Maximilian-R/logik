import { MVector } from '../Utilities/MVector.js';

export class World {
    constructor(camera) {
        this.position = MVector.Create();
        this.gameObjects = [];
        this.camera = camera;
    }

    addToWorld(gameObject) {
        this.gameObjects.push(gameObject);
        const byLayer = (a, b) => {
            return a.layer - b.layer;
        };
        this.gameObjects.sort(byLayer);
        return gameObject;
    }

    removeFromWorld(gameObject) {
        gameObject.remove();
        return this.gameObjects.splice(this.gameObjects.indexOf(gameObject), 1);
    }

    positionInWorld(position) {
        return position.add(this.camera.position.copy());
    }

    draw() {
        sketch.push();
        sketch.translate(this.position.x, this.position.y);

        this.gameObjects.forEach((o) => {
            o.gameDraw();
        });
        sketch.pop();
    }

    update() {
        this.gameObjects.forEach((o) => {
            o.gameUpdate();
        });
    }
}
