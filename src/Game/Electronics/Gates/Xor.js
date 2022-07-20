import { InputSocket, OutputSocket } from '../Socket';
import { Gate } from './Gate';

export class XorGate extends Gate {
    constructor(position, id) {
        const onNextInput = (state) => {
            const onInputs = this.inputs.filter((input) => input.electronic.isOn);
            if (onInputs.length === 1) {
                this.electronic.nextState(onInputs[0].electronic.power);
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
            'Xor',
            onNextState,
            [new InputSocket(null, onNextInput), new InputSocket(null, onNextInput)],
            [new OutputSocket()],
        );
    }
}
