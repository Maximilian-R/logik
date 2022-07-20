import { InputSocket, OutputSocket, Socket, ToggleSocket } from '../Socket';
import { Gate } from './Gate';

export class SelectorGate extends Gate {
    constructor(position, id) {
        const onNextState = (state) => {
            //this.outputs[0].electronic.nextState(state.power);
        };

        super(id, position, 'Selector', onNextState);

        this.selected = 0;

        this.settings = {
            ...this.settings,
            choices: 2,
        };

        this.generateSockets(this.settings.choices);
    }

    applySettings(settings) {
        super.applySettings(settings);
        if (settings.choices !== this.inputs.length) {
            this.generateSockets(settings.choices);
        }
    }

    generateSockets(choices) {
        const onNextInput = (state) => {
            const on = this.inputs.find((socket) => socket.electronic.isOn);
            if (on) {
                const index = this.inputs.indexOf(on);
                this.outputs[this.selected]?.electronic.nextState(0);
                this.selected = index;
                this.outputs[this.selected].electronic.nextState(100);
            }
        };

        const onNextCycle = (state) => {
            this.outputs[this.selected]?.electronic.nextState(0);
            if (state.power < 0) {
                this.selected -= 1;
                if (this.selected < 0) {
                    this.selected = this.outputs.length - 1;
                }
            } else if (state.power > 0) {
                this.selected += 1;
                if (this.selected > this.outputs.length - 1) {
                    this.selected = 0;
                }
            }
            this.outputs[this.selected].electronic.nextState(100);
        };

        const inputs = [...Array(choices).keys()].map(() => new InputSocket(null, onNextInput));
        const outputs = [...Array(choices).keys()].map(() => new OutputSocket());
        const reset = new ToggleSocket(null, onNextCycle);

        this.selected = 0;
        outputs[this.selected].electronic.nextState(100);

        this._setup(inputs, outputs, reset);
    }

    createGUI(gui) {
        super.createGUI(gui);
        gui.add(this.settings, 'choices')
            .min(2)
            .max(10)
            .step(1)
            .onChange((event) => {
                this.generateSockets(event);
            });
    }
}
