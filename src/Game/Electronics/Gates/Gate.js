import { MVector } from '../../../Utilities/MVector';
import { ColliderBox, Dimension } from '../../Collission';
import {
    GATE_COLOR,
    GATE_FRAME_COLOR,
    GATE_FRAME_WIDTH,
    GATE_GRID_SIZE,
    GATE_HIGHLIGHT_COLOR,
    GATE_MIN_GRID_SIZE,
    GATE_RECT_RADIUS,
} from '../../Constants';
import { Electronic } from '../Electronic';
import { Item } from '../Item';

export class Gate extends Item {
    constructor(id, position, name, onNextState, inputs, outputs, reset) {
        super(id, position, name);

        this.electronic = new Electronic(onNextState);

        this.name = name ?? '';
        this.text;

        this.dimension = new Dimension(0, 0);
        this.collider;

        /* Sockets */
        this.inputs;
        this.outputs;
        this.reset;

        /* Draw */
        this.isHighlight = false;

        this.settings = {
            ...this.settings,
            name: this.name,
        };

        this._setup(inputs, outputs, reset);
    }

    createGUI(gui) {
        super.createGUI(gui);
        gui.add(this.settings, 'name');
    }

    get width() {
        return this.dimension.width;
    }

    get height() {
        return this.dimension.height;
    }

    get power() {
        return this.electronic.power;
    }

    _setup(inputs, outputs, reset) {
        // Reset in case of regeneration of sockets
        this.inputs?.forEach((input) => input.removeFromParent());
        this.outputs?.forEach((output) => output.removeFromParent());
        this.reset?.removeFromParent();
        this.collider?.remove();
        this.inputs = inputs;
        this.outputs = outputs;
        this.reset = reset;

        const maxSockets = sketch.max(inputs?.length, outputs?.length);
        this.dimension = new Dimension(GATE_MIN_GRID_SIZE * GATE_GRID_SIZE, sketch.max(GATE_MIN_GRID_SIZE, maxSockets) * GATE_GRID_SIZE);

        if (reset) {
            reset.position = MVector.Create(0, this.height / 2);
            this.addChild(reset);
        }

        let inputOffset = inputs?.length > 1 ? -GATE_GRID_SIZE * 0.5 : 0;
        inputs?.forEach((socket, i) => {
            const y = inputOffset + GATE_GRID_SIZE * (i + 1) - this.height / 2;
            const x = -this.width / 2;
            socket.position = MVector.Create(x, y);
            this.addChild(socket);
        });

        const outputOffset = outputs?.length > 1 ? -GATE_GRID_SIZE * 0.5 : 0;
        outputs?.forEach((socket, i) => {
            const y = outputOffset + GATE_GRID_SIZE * (i + 1) - this.height / 2;
            const x = this.width / 2;
            socket.position = MVector.Create(x, y);
            this.addChild(socket);
        });

        this.collider = new ColliderBox(this, this.dimension);
        this.collider.onMouseEnter = () => {
            this.isHighlight = true;
        };
        this.collider.onMouseLeave = () => {
            this.isHighlight = false;
        };
    }

    draw() {
        sketch.fill(GATE_COLOR);
        sketch.strokeWeight(GATE_FRAME_WIDTH);
        if (this.isHighlight) {
            sketch.stroke(GATE_HIGHLIGHT_COLOR);
        } else {
            sketch.stroke(GATE_FRAME_COLOR);
        }
        sketch.strokeWeight(6);
        sketch.rect(0, 0, this.width, this.height, GATE_RECT_RADIUS, GATE_RECT_RADIUS);

        /* Text Above Frame */
        sketch.noStroke();
        sketch.fill(GATE_COLOR);
        sketch.textAlign(sketch.CENTER);
        sketch.text(this.settings.name, 0, -this.height / 2 - 6);

        /* Center Text */
        if (this.text) {
            sketch.textAlign(sketch.CENTER);
            sketch.fill(255);
            sketch.noStroke();
            sketch.text(this.text, 0, 0);
        }
    }
}
