import { OutputSocket, ToggleSocket } from '../Socket';
import { Gate } from './Gate';

export class ToggleGate extends Gate {
    constructor(position, id) {
        const onNextInput = (state) => {
            if (this.electronic.isOn) {
                this.electronic.nextState(0);
            } else {
                this.electronic.nextState(100);
            }
        };

        const onNextState = (state) => {
            this.outputs[0].electronic.nextState(state.power);
        };

        super(id, position, 'Toggle', onNextState, [new ToggleSocket(null, onNextInput)], [new OutputSocket()]);
    }
}
