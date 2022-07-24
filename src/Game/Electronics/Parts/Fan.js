import { ColliderBox, Dimension } from '../../Collission';
import { GATE_COLOR, GATE_FRAME_COLOR, GATE_FRAME_WIDTH, GATE_HIGHLIGHT_COLOR, GRID_SIZE_RENDER } from '../../Constants';
import { InputSocket } from '../Socket';
import { MVector } from '../../../Utilities/MVector';
import { Item } from '../Item';

export class Fan extends Item {
    constructor(position, id) {
        super(id, position, 'Fan');

        this.dimension = new Dimension(GRID_SIZE_RENDER * 3, GRID_SIZE_RENDER * 3);
        this.collider = new ColliderBox(this, this.dimension);
        this.collider.onMouseEnter = () => {
            this.isHighlight = true;
        };
        this.collider.onMouseLeave = () => {
            this.isHighlight = false;
        };

        /* Sockets */
        const onNextInput = (state) => {
            this.power = state.power;
        };
        const socket = new InputSocket(MVector.Create(-this.dimension.width / 2, 0), onNextInput);
        this.input = this.addChild(socket);

        /* Attributes */
        this.isHighlight = false;
        this.power = 0;
        this.velocity = 0;
        this.speed = 0;
        this.angle = 0;
    }

    draw() {
        sketch.push();
        sketch.stroke(GATE_HIGHLIGHT_COLOR);
        sketch.strokeWeight(2);
        sketch.fill(GATE_COLOR);

        sketch.rotate(this.angle);

        const distance = sketch.TWO_PI / 3;

        const size = this.dimension.width - GATE_FRAME_WIDTH - 2;
        sketch.arc(0, 0, size, size, distance * 0, distance * 0 + sketch.QUARTER_PI, sketch.PIE);
        sketch.arc(0, 0, size, size, distance * 1, distance * 1 + sketch.QUARTER_PI, sketch.PIE);
        sketch.arc(0, 0, size, size, distance * 2, distance * 2 + sketch.QUARTER_PI, sketch.PIE);
        sketch.ellipse(0, 0, 12, 12);

        sketch.noFill();
        sketch.strokeWeight(GATE_FRAME_WIDTH);
        if (this.isHighlight) {
            sketch.stroke(GATE_HIGHLIGHT_COLOR);
        } else {
            sketch.stroke(GATE_FRAME_COLOR);
        }
        sketch.ellipse(0, 0, this.dimension.width, this.dimension.height);
        sketch.pop();
    }

    update() {
        this.velocity += this.power;
        this.velocity *= 0.98; // friction
        this.speed += this.velocity;

        // prevent supersmall numbers
        if (sketch.abs(this.velocity) < 0.0001) {
            this.velocity = 0;
            this.speed = 0;
        }

        this.angle = this.speed / (sketch.TWO_PI * 1000);
    }

    remove() {
        super.remove();
    }
}
