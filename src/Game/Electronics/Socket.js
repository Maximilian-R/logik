import { ColliderBox, Dimension } from '../Collission';
import { SOCKET_HIGHLIGHT_COLOR, SOCKET_OFF_COLOR, SOCKET_ON_COLOR } from '../Constants';
import { GameObject } from '../GameObject';
import { Electronic } from './Electronic';

export class Socket extends GameObject {
    constructor(position, onNextState) {
        super(position);
        this.electronic = new Electronic(onNextState);
        this.dimension = new Dimension(12, 12);

        this.wire;

        this.collider = new ColliderBox(this, this.dimension);
        this.collider.onMouseEnter = () => {
            this.isHighlight = true;
        };
        this.collider.onMouseLeave = () => {
            this.isHighlight = false;
        };

        /* Draw */
        this.isHighlight = false;
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

    update() {
        super.update();
    }

    draw() {
        super.draw();
        if (this.isHighlight) {
            sketch.strokeWeight(2);
            sketch.stroke(SOCKET_HIGHLIGHT_COLOR);
        } else {
            sketch.noStroke();
        }

        if (this.electronic.isOn) {
            sketch.fill(SOCKET_ON_COLOR);
        } else {
            sketch.fill(SOCKET_OFF_COLOR);
        }
        sketch.rect(0, 0, this.width, this.height, 3, 3);
    }
}

export class InputSocket extends Socket {
    constructor(position, onNextState) {
        super(position, onNextState);
    }

    hasConnection() {
        return !!this.wire;
    }

    connect(wire) {
        this.wire = wire;
    }

    disconnect(wire) {
        this.wire = undefined;
        this.electronic.nextState(0);
    }

    remove() {
        if (this.wire) {
            const wire = this.wire;
            wire.remove();
            game.world.removeFromWorld(wire);
        }

        super.remove();
    }
}

export class OutputSocket extends Socket {
    constructor(position) {
        const onNextState = (state) => {
            this.wire.forEach((wire) => {
                wire.input?.electronic.nextState(state.power);
            });
        };
        super(position, onNextState);

        this.wire = [];
    }

    connect(wire) {
        this.wire.push(wire);
    }

    disconnect(wire) {
        this.wire.splice(this.wire.indexOf(wire));
    }

    remove() {
        if (this.wire) {
            const wire = [...this.wire];
            wire.forEach((wire) => {
                wire.remove();
                game.world.removeFromWorld(wire);
            });
        }

        super.remove();
    }
}

export class ToggleSocket extends InputSocket {
    constructor(position, onNextState) {
        const _onNextState = (state) => {
            // Toggle when going from 0 to on, or from positive <-> negative
            if (state.power !== this.lastPower) {
                const wasZero = state.power !== 0 && this.lastPower === 0;
                const posToNeg = state.power < 0 && this.lastPower > 0;
                const negToPos = state.power > 0 && this.lastPower < 0;
                if (wasZero || posToNeg || negToPos) {
                    onNextState(state);
                }
                this.lastPower = state.power;
            }
        };
        super(position, _onNextState);

        this.lastPower = 0;
    }
}
