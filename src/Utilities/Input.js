import { Subject, Event } from './Event.js';
import { MVector } from './MVector.js';

export class Input extends Subject {
    constructor() {
        super();
        this.events = ['MOUSE_DOWN', 'MOUSE_UP', 'MOUSE_DRAG', 'MOUSE_MOVE', 'KEY_PRESS', 'KEY_RELEASE', 'MOUSE_SCROLL'];

        sketch.mousePressed = (event) => {
            if (event.target.id === 'defaultCanvas0') {
                this.onMouseDown(this.mouse);
            }
        };
        sketch.mouseDragged = () => {
            this.onMouseDrag(this.mouse);
        };
        sketch.mouseReleased = () => {
            this.onMouseUp(this.mouse);
        };
        sketch.mouseMoved = () => {
            this.onMouseMove(this.mouse);
        };
        sketch.keyPressed = () => {
            this.onKeyPress(sketch.key, sketch.keyCode);
        };
        sketch.keyReleased = () => {
            this.onKeyRelease(sketch.key, sketch.keyCode);
        };
        sketch.mouseWheel = (event) => {
            this.onMouseScroll(this.mouse, MVector.Create(event.deltaX, event.deltaY));
        };
    }

    onMouseDown(position) {
        var event = new MouseEvent(this.events[0], position, sketch.mouseButton);
        this.notifyObservers(event);
    }

    onMouseUp(position) {
        var event = new MouseEvent(this.events[1], position, sketch.mouseButton);
        this.notifyObservers(event);
    }

    onMouseDrag(position) {
        var event = new MouseEvent(this.events[2], position, sketch.mouseButton);
        this.notifyObservers(event);
    }

    onMouseMove(position) {
        var event = new MouseEvent(this.events[3], position, sketch.mouseButton);
        this.notifyObservers(event);
    }

    onKeyPress(key, keyCode) {
        var event = new KeyEvent(this.events[4], key, keyCode);
        this.notifyObservers(event);
    }

    onKeyRelease(key, keyCode) {
        var event = new KeyEvent(this.events[5], key, keyCode);
        this.notifyObservers(event);
    }

    onMouseScroll(position, delta) {
        var event = new ScrollEvent(this.events[6], position, sketch.mouseButton, delta);
        this.notifyObservers(event);
    }

    get mouse() {
        return MVector.Create(sketch.mouseX, sketch.mouseY);
    }
}

export class MouseEvent extends Event {
    constructor(event, position, button) {
        super(event);
        this.position = position;
        this.button = button;
    }
}

export class KeyEvent extends Event {
    constructor(event, key, keyCode) {
        super(event);
        this.key = key;
        this.keyCode = keyCode;
    }
}

export class ScrollEvent extends MouseEvent {
    constructor(event, position, button, delta) {
        super(event, position, button);
        this.delta = delta;
    }
}
