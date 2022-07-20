import { MVector } from '../Utilities/MVector.js';
import { ScrollEvent } from '../Utilities/Input.js';
import { SCALE } from './Constants.js';

export class Camera {
    constructor() {
        this.position = MVector.Create();
        this.scale = SCALE;
    }

    positionInWorld(position) {
        return MVector.Add(position.div(this.scale), this.position);
    }

    teleport(position, center = true) {
        if (center) {
            position = MVector.Sub(position, MVector.Create(sketch.width / 2 / this.scale, sketch.height / 2 / this.scale));
        }
        this.position.x = position.x;
        this.position.y = position.y;
    }

    scroll(delta) {
        this.teleport(MVector.Add(this.position, delta), false);
    }

    draw() {
        sketch.scale(this.scale);
        sketch.translate(-this.position.x, -this.position.y);
    }
}

export class CameraController {
    constructor(inputManager, camera) {
        this.camera = camera;
        this.speed = 10;
        inputManager.registerObserver(this, this.onEventNotify);
    }

    onEventNotify(event) {
        if (event instanceof ScrollEvent) {
            this.camera.scroll(event.delta);
        }
    }

    update() {
        if (sketch.keyIsPressed) {
            const delta = MVector.Create();
            if (sketch.keyIsDown(sketch.UP_ARROW)) {
                delta.y += -this.speed;
            }
            if (sketch.keyIsDown(sketch.DOWN_ARROW)) {
                delta.y += this.speed;
            }
            if (sketch.keyIsDown(sketch.LEFT_ARROW)) {
                delta.x += -this.speed;
            }
            if (sketch.keyIsDown(sketch.RIGHT_ARROW)) {
                delta.x += this.speed;
            }
            this.camera.scroll(delta);
        }
    }
}
