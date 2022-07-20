import { InputSocket, OutputSocket, ToggleSocket } from '../Socket';
import { Gate } from './Gate';

export class TimerGate extends Gate {
    constructor(position, id) {
        const onNextInput = (state) => {
            //this.electronic.nextState(state.power);
        };

        const onNextReset = (state) => {
            this.current = 0;
            this.electronic.nextState(0);
            this.setText();
        };

        const onNextState = (state) => {
            this.outputs[0].electronic.nextState(state.power);
        };

        super(
            id,
            position,
            'Timer',
            onNextState,
            [new InputSocket(null, onNextInput)],
            [new OutputSocket()],
            new ToggleSocket(null, onNextReset),
        );

        this.current = 0;

        this.settings = {
            ...this.settings,
            max: 100,
        };

        this.setText();
    }

    createGUI(gui) {
        super.createGUI(gui);
        gui.add(this.settings, 'max').step(1);
    }

    setText() {
        this.text = sketch.int((this.current / this.settings.max) * 100) + '%';
    }

    update() {
        super.update();
        if (this.inputs[0].electronic.isOn) {
            if (this.current < this.settings.max) {
                this.current += 1;
                this.setText();
                if (this.current === this.settings.max) {
                    this.electronic.nextState(100);
                }
            }
        }
    }
}
