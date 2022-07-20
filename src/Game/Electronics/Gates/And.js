import { InputSocket, OutputSocket } from '../Socket';
import { Gate } from './Gate';

export class AndGate extends Gate {
    constructor(position, id) {
        const onNextInput = (state) => {
            if (this.inputs.every((input) => input.electronic.isOn)) {
                const minimum = Math.min(...this.inputs.map((input) => input.electronic.power));
                this.electronic.nextState(minimum);
            } else {
                this.electronic.nextState(0);
            }
        };

        const onNextState = (state) => {
            this.outputs[0].electronic.nextState(state.power);
        };

        super(
            id,
            position,
            'And',
            onNextState,
            [new InputSocket(null, onNextInput), new InputSocket(null, onNextInput)],
            [new OutputSocket()],
        );
    }
}
