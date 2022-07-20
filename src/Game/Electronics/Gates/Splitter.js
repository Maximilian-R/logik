import { InputSocket, OutputSocket } from '../Socket';
import { Gate } from './Gate';

/* Separate positive and negative signals */
export class SplitterGate extends Gate {
    constructor(position, id) {
        const onNextInput = (state) => {
            this.electronic.nextState(state.power);
        };

        const onNextState = (state) => {
            this.outputs[0].electronic.nextState(state.power > 0 ? 100 : 0);
            this.outputs[1].electronic.nextState(state.power < 0 ? 100 : 0);
        };

        super(id, position, 'Splitter', onNextState, [new InputSocket(null, onNextInput)], [new OutputSocket(), new OutputSocket()]);
    }
}
