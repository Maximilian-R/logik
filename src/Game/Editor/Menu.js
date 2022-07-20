import { SCALE } from '../Constants';
import { SaveManager } from '../Serializable/SaveManager';
import * as dat from 'dat.gui';
import {
    AndGate,
    BatteryGate,
    CombinerGate,
    CounterGate,
    KeyGate,
    MeasureGate,
    NotGate,
    OrGate,
    SelectorGate,
    SplitterGate,
    TimerGate,
    ToggleGate,
    XorGate,
} from '../Electronics/Gates';

import { Light } from '../Electronics/Parts/Light';
import { Fan } from '../Electronics/Parts/Fan';
import { SwitchGate } from '../Electronics/Gates/Switch';

export class Menu {
    constructor(editor) {
        this.editor = editor;

        const menu = {
            grid: true,
            scale: SCALE,
            save: () => {
                SaveManager.save(this.editor.world.gameObjects);
            },
            load: () => {
                SaveManager.load((gameObjects) => {
                    gameObjects.forEach((gameObject) => {
                        this.editor.world.addToWorld(gameObject);
                    });
                });
            },
        };

        const gui = new dat.GUI({ name: 'Menu', hideable: false });

        gui.add(menu, 'scale', 0.5, 2, 0.1)
            .name('Scale')
            .onChange((event) => (this.editor.world.camera.scale = event));
        gui.add(menu, 'grid')
            .name('Grid')
            .onChange((event) => (this.editor.grid.render = event));
        gui.add(menu, 'save').name('Save');
        gui.add(menu, 'load').name('Load');

        const gatesMenu = {
            and: () => this.editor.placeItem(AndGate),
            battery: () => this.editor.placeItem(BatteryGate),
            combiner: () => this.editor.placeItem(CombinerGate),
            counter: () => this.editor.placeItem(CounterGate),
            key: () => this.editor.placeItem(KeyGate),
            measure: () => this.editor.placeItem(MeasureGate),
            not: () => this.editor.placeItem(NotGate),
            or: () => this.editor.placeItem(OrGate),
            selector: () => this.editor.placeItem(SelectorGate),
            splitter: () => this.editor.placeItem(SplitterGate),
            switch: () => this.editor.placeItem(SwitchGate),
            timer: () => this.editor.placeItem(TimerGate),
            toggle: () => this.editor.placeItem(ToggleGate),
            xor: () => this.editor.placeItem(XorGate),
        };

        const gatesFolder = gui.addFolder('Gates');
        for (const [key, value] of Object.entries(gatesMenu)) {
            gatesFolder.add(gatesMenu, key).name(key.charAt(0).toUpperCase() + key.slice(1));
        }

        const partsMenu = {
            fan: () => this.editor.placeItem(Fan),
            light: () => this.editor.placeItem(Light),
        };

        const partsFolder = gui.addFolder('Parts');
        for (const [key, value] of Object.entries(partsMenu)) {
            partsFolder.add(partsMenu, key).name(key.charAt(0).toUpperCase() + key.slice(1));
        }
    }
}
