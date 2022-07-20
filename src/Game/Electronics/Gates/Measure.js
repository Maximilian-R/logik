import { InputSocket, OutputSocket } from '../Socket';
import { Gate } from './Gate';

export class MeasureGate extends Gate {
    constructor(position, id) {
        const onNextInput = (state) => {
            this.electronic.nextState(state.power);
        };

        const onNextState = (state) => {
            this.text = state.power.toString();
            this.outputs[0].electronic.nextState(state.power);
        };

        super(id, position, 'Measure', onNextState, [new InputSocket(null, onNextInput)], [new OutputSocket()]);

        this.text = this.electronic.power.toString();
    }
}
