import { GameObject } from '../GameObject';

export class Item extends GameObject {
    constructor(id, position, className) {
        super(position, id);
        this.settings = {};
        this.className = className;
    }

    applySettings(settings) {
        this.settings = {
            ...this.settings,
            ...settings,
        };
    }

    createGUI(gui) {
        gui.add(this, 'className').name('Item');
    }

    serialize() {
        const json = super.serialize();
        json.name = this.className;
        json.settings = this.settings;
        return json;
    }
}
