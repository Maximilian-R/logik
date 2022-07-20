import { InputSocket, OutputSocket, Socket } from '../Socket';
import { Gate } from './Gate';

export class OrGate extends Gate {
    constructor(position, id) {
        const onNextInput = (state) => {
            if (this.inputs.some((input) => input.electronic.isOn)) {
                const maximum = Math.max(...this.inputs.filter((input) => input.electronic.isOn).map((input) => input.electronic.power));
                this.electronic.nextState(maximum);
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
            'Or',
            onNextState,
            [new InputSocket(null, onNextInput), new InputSocket(null, onNextInput)],
            [new OutputSocket()],
        );
    }
}
