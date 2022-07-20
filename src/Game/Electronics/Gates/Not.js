import { InputSocket, OutputSocket } from '../Socket';
import { Gate } from './Gate';

export class NotGate extends Gate {
    constructor(position, id) {
        const onNextInput = (state) => {
            this.electronic.nextState(100 - state.power);
        };

        const onNextState = (state) => {
            this.outputs[0].electronic.nextState(state.power);
        };

        super(id, position, 'Not', onNextState, [new InputSocket(null, onNextInput)], [new OutputSocket()]);
        this.electronic.nextState(100);
    }
}
