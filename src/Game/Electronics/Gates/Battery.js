import { OutputSocket } from '../Socket';
import { Gate } from './Gate';

export class BatteryGate extends Gate {
    constructor(position, id) {
        const onNextState = (state) => {
            this.text = state.power.toString();
            this.outputs[0].electronic.nextState(state.power);
        };

        super(id, position, 'Battery', onNextState, [], [new OutputSocket()]);

        this.electronic.nextState(100);

        this.settings = {
            ...this.settings,
            battery: 100,
        };
    }

    applySettings(settings) {
        super.applySettings(settings);
        this.electronic.nextState(settings.battery);
    }

    createGUI(gui) {
        super.createGUI(gui);
        gui.add(this.settings, 'battery')
            .min(-100)
            .max(100)
            .step(1)
            .onChange((event) => {
                this.electronic.nextState(event);
            });
    }
}
