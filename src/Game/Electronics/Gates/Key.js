import { KeyEvent } from '../../../Utilities/Input';
import { OutputSocket } from '../Socket';
import { Gate } from './Gate';

export class KeyGate extends Gate {
    constructor(position, id) {
        const onNextState = (state) => {
            this.outputs[0].electronic.nextState(state.power);
        };

        super(id, position, 'Key', onNextState, [], [new OutputSocket()]);

        this.settings = {
            ...this.settings,
            key: 'A',
        };

        this.text = this.settings.key;

        game.inputManager.registerObserver(this, this.onEvent);
    }

    applySettings(settings) {
        super.applySettings(settings);
        this.text = this.settings.key;
    }

    createGUI(gui) {
        super.createGUI(gui);
        gui.add(this.settings, 'key').onChange(() => {
            this.text = this.settings.key;
        });
    }

    onEvent(event) {
        if (event instanceof KeyEvent) {
            if (event.key === this.settings.key) {
                if (event.event === 'KEY_PRESS') {
                    this.electronic.nextState(100);
                }
                if (event.event === 'KEY_RELEASE') {
                    this.electronic.nextState(0);
                }
            }
        }
    }
}
