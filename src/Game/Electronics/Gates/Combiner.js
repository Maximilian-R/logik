import { InputSocket, OutputSocket } from '../Socket';
import { Gate } from './Gate';

/* Takes two inputs, first will be output as positve, second as negative signal */
export class CombinerGate extends Gate {
    constructor(position, id) {
        const onNextInput = (state) => {
            const positive = this.inputs[0].electronic.isOn ? 100 : 0;
            const negative = this.inputs[1].electronic.isOn ? 100 : 0;

            this.electronic.nextState(positive - negative);
        };

        const onNextState = (state) => {
            this.outputs[0].electronic.nextState(state.power);
        };

        super(
            id,
            position,
            'Combiner',
            onNextState,
            [new InputSocket(null, onNextInput), new InputSocket(null, onNextInput)],
            [new OutputSocket()],
        );
    }
}
