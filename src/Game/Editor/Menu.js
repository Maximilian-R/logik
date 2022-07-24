import { SCALE } from '../Constants';
import { SaveManager } from '../Serializable/SaveManager';
import * as dat from 'dat.gui';

import { ITEM_CLASSES } from '../Serializable/ItemFactory';

export class Menu {
    constructor(editor) {
        this.editor = editor;

        const menu = {
            grid: true,
            scale: SCALE,
            pathFindingDraw: false,
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
        gui.add(menu, 'pathFindingDraw')
            .name('Draw Path Finding')
            .onChange((event) => (game.pathFinding.debugDraw = event));
        gui.add(menu, 'save').name('Save');
        gui.add(menu, 'load').name('Load');

        const gatesMenu = {};
        for (const [key, value] of Object.entries(ITEM_CLASSES.gates)) {
            gatesMenu[key] = () => this.editor.placeItem(value);
        }

        const gatesFolder = gui.addFolder('Gates');
        for (const [key, value] of Object.entries(gatesMenu)) {
            gatesFolder.add(gatesMenu, key).name(key.charAt(0).toUpperCase() + key.slice(1));
        }

        const partsMenu = {};
        for (const [key, value] of Object.entries(ITEM_CLASSES.parts)) {
            partsMenu[key] = () => this.editor.placeItem(value);
        }

        const partsFolder = gui.addFolder('Parts');
        for (const [key, value] of Object.entries(partsMenu)) {
            partsFolder.add(partsMenu, key).name(key.charAt(0).toUpperCase() + key.slice(1));
        }
    }
}
