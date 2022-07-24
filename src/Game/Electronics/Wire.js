import { WIRE_OFF_COLOR, WIRE_ON_COLOR } from '../Constants';
import { GameObject } from '../GameObject';

export class Wire extends GameObject {
    constructor(output, input) {
        super();
        this.layer = 0;

        this.waypoints = [];
        this.output = output;
        this.input = input;

        // change this in edit mode when creating the wire
        this.endPosition = this._output.getGlobalPosition();

        this.thickness = 6;
        this.customColor;
    }

    set input(socket) {
        this._input = socket;

        if (socket) {
            socket.connect(this);
            // set current state
            socket.electronic.nextState(this.output.electronic.power);
        }
    }
    get input() {
        return this._input;
    }

    set output(socket) {
        if (socket) {
            this._output = socket;
            socket.connect(this);
        }
    }
    get output() {
        return this._output;
    }

    get isOn() {
        return this.output.electronic.isOn;
    }

    get color() {
        return this.customColor ?? (this.isOn ? WIRE_ON_COLOR : WIRE_OFF_COLOR);
    }

    addWaypoint(position) {
        this.waypoints.push(position);
    }

    addWaypoints(positions) {
        this.waypoints.push(...positions);
    }

    removeWaypoint() {
        this.waypoints.splice(this.waypoints.length - 1);
    }

    remove() {
        if (this.input) {
            this.input.disconnect(this);
        }
        if (this.output) {
            this.output.disconnect(this);
        }

        super.remove();
    }

    draw() {
        super.draw();
        sketch.stroke(this.color);
        sketch.strokeCap(sketch.PROJECT);
        sketch.strokeWeight(this.thickness);
        sketch.noFill();

        let startPoint = this.output.getGlobalPosition();

        let endPoint;
        if (this.input) {
            endPoint = this.input.getGlobalPosition();
        } else {
            endPoint = this.endPosition;
        }

        const path = [];
        path.push(startPoint);
        path.push(...this.waypoints);
        path.push(endPoint);

        path.reduce((prev, curr, index) => {
            if (prev) {
                sketch.line(prev.x, prev.y, curr.x, curr.y);
            }
            return curr;
        });

        sketch.fill(this.color);
        sketch.noStroke();

        this.waypoints.forEach((position) => {
            sketch.rect(position.x, position.y, 12, 12, 3, 3);
        });
        if (!this.input) {
            sketch.rect(endPoint.x, endPoint.y, 12, 12, 3, 3);
        }
    }

    serialize() {
        const json = super.serialize();
        json.name = 'Wire';
        json.output = this.output.id;
        json.input = this.input.id;
        json.waypoints = this.waypoints.map((position) => [position.x, position.y]);
        return json;
    }
}
