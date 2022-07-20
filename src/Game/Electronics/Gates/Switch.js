import { InputSocket, OutputSocket } from '../Socket';
import { Gate } from './Gate';

export class SwitchGate extends Gate {
    constructor(position, id) {
        const onNextInput = (state) => {
            this.electronic.nextState(state.power);
        };

        const onNextReset = (state) => {
            this.electronic.nextState(this.inputs[0].electronic.power);
        };

        const onNextState = (state) => {
            this.outputs[0].electronic.nextState(this.reset.electronic.isOn ? state.power : 0);
        };

        super(
            id,
            position,
            'Switch',
            onNextState,
            [new InputSocket(null, onNextInput)],
            [new OutputSocket()],
            new InputSocket(null, onNextReset),
        );

        this.open = false;
    }
}
