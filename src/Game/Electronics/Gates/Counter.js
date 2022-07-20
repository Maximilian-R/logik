import { OutputSocket, ToggleSocket } from '../Socket';
import { Gate } from './Gate';

export class CounterGate extends Gate {
    constructor(position, id) {
        const onNextInput = (state) => {
            this.current += state.power > 0 ? 1 : -1;
            if (this.current >= this.settings.max) {
                this.current = this.settings.max;
                this.electronic.nextState(100);
            } else if (this.current <= this.settings.min) {
                this.current = this.settings.min;
                this.electronic.nextState(0);
            } else {
                this.text = this.current.toString();
            }
        };

        const onNextReset = (state) => {
            this.current = 0;
            this.electronic.nextState(0);
        };

        const onNextState = (state) => {
            this.outputs[0].electronic.nextState(state.power);
            this.text = this.current.toString();
        };

        super(
            id,
            position,
            'Counter',
            onNextState,
            [new ToggleSocket(null, onNextInput)],
            [new OutputSocket()],
            new ToggleSocket(null, onNextReset),
        );

        this.current = 0;
        this.settings = {
            ...this.settings,
            min: 0,
            max: 10,
        };

        this.text = this.current.toString();
    }

    createGUI(gui) {
        super.createGUI(gui);
        gui.add(this.settings, 'min').step(1);
        gui.add(this.settings, 'max').step(1);
    }
}
