import { Subject, Event } from '../Utilities/Event.js';
import { MVector } from '../Utilities/MVector.js';

export class Cursor extends Subject {
    constructor(camera, grid) {
        super();
        this.camera = camera;
        this.grid = grid;
        this.position = MVector.Create();
        this.lastPosition = MVector.Create();
    }

    draw() {
        //sketch.fill(0);
        //sketch.ellipse(this.position.x, this.position.y, 10);
    }

    update() {
        this.lastPosition = this.position;
        const mouse = MVector.Create(sketch.mouseX, sketch.mouseY);
        this.position = this.camera.positionInWorld(mouse);

        this.position = this.grid.snapToGrid(this.position);
        this.grid.move(this.position);
        if (!MVector.Equals(this.lastPosition, this.position)) {
            this.notifyObservers(new CursorEvent(this.position));
        }
    }
}

export class CursorEvent extends Event {
    constructor(position) {
        super('CURSOR_MOVED');
        this.position = position;
    }
}
