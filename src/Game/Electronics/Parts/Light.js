import { ColliderBox, Dimension } from '../../Collission';
import { GATE_HIGHLIGHT_COLOR, GATE_RECT_RADIUS, GRID_SIZE_RENDER, LIGHT_OFF_COLOR, LIGHT_ON_COLOR } from '../../Constants';
import { InputSocket } from '../Socket';
import { MVector } from '../../../Utilities/MVector';
import { Item } from '../Item';

export class Light extends Item {
    constructor(position, id) {
        super(id, position, 'Light');

        this.dimension = new Dimension(GRID_SIZE_RENDER, GRID_SIZE_RENDER);
        this.collider = new ColliderBox(this, this.dimension);
        this.collider.onMouseEnter = () => {
            this.isHighlight = true;
        };
        this.collider.onMouseLeave = () => {
            this.isHighlight = false;
        };

        /* Sockets */
        const onNextInput = (state) => {
            this.setColor(state.power);
        };
        const socket = new InputSocket(MVector.Create(-this.dimension.width / 2, 0), onNextInput);
        this.input = this.addChild(socket);

        /* Color Attributes */
        this.color = LIGHT_OFF_COLOR;
        this.isHighlight = false;

        this.settings = {
            ...this.settings,
            color: LIGHT_ON_COLOR,
        };
    }

    createGUI(gui) {
        super.createGUI(gui);
        gui.addColor(this.settings, 'color').onChange((event) => {
            this.setColor(this.input.power);
        });
    }

    setColor(power) {
        this.color = sketch.lerpColor(
            sketch.color(LIGHT_OFF_COLOR),
            sketch.color(this.settings.color),
            sketch.map(Math.abs(power), 0, 100, 0, 1),
        );
    }

    draw() {
        if (this.isHighlight) {
            sketch.strokeWeight(2);
            sketch.stroke(GATE_HIGHLIGHT_COLOR);
        } else {
            sketch.noStroke();
        }
        sketch.fill(this.color);
        sketch.rect(0, 0, this.dimension.width, this.dimension.height, GATE_RECT_RADIUS, GATE_RECT_RADIUS);
    }

    remove() {
        super.remove();
    }
}
