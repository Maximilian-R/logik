import { MouseEvent } from '../../Utilities/Input';
import { Cursor } from '../Cursor';
import { Grid } from '../Grid';
import { Menu } from './Menu';
import { DefaultState } from './States/Default';
import * as dat from 'dat.gui';
import { MoveItemState } from './States/MoveItemState';

export class Editor {
    constructor(world, inputManager, collisionManager) {
        this.world = world;
        this.grid = new Grid();
        this.cursor = new Cursor(this.world.camera, this.grid);
        this.collisionManager = collisionManager;

        this.menu = new Menu(this);

        this.gui;

        this.state;
        this.nextState = new DefaultState(this);

        inputManager.registerObserver(this, this.onEvent);
    }

    placeItem(itemClass) {
        const item = new itemClass();
        item.position = this.cursor.position;
        this.world.addToWorld(item);
        this.nextState = new MoveItemState(this, item);
    }

    openGUI(item) {
        if (this.gui) {
            this.gui.destroy();
        }
        const menu = {
            destroy: () => {
                this.world.removeFromWorld(item);
                this.gui.destroy();
                this.gui = undefined;
            },
        };
        this.gui = new dat.GUI();
        this.gui.add(menu, 'destroy');
        item.createGUI(this.gui);
    }

    update() {
        this.cursor.update();

        if (this.nextState) {
            this.state?.onExit();
            this.state = this.nextState;
            this.state.onEnter();
            this.nextState = undefined;
        }
        this.nextState = this.state.update();
    }

    draw() {
        this.grid.draw();
        this.cursor.draw();
    }

    onEvent(event) {
        if (event instanceof MouseEvent) {
            if (event.event === 'MOUSE_MOVE') {
                const position = this.world.camera.positionInWorld(event.position);
                this.collisionManager.mouseMove(position);
            }
        }
        this.state.onEvent(event);
    }
}
