import { EditorState } from './EditorState';
import { GRID_SIZE } from '../../Constants';
import { InputSocket } from '../../Electronics/Socket';
import { KeyEvent, MouseEvent } from '../../../Utilities/Input';
import { Wire } from '../../Electronics/Wire';
import { DefaultState } from './Default';

export class CreateWireState extends EditorState {
    constructor(editor, socket) {
        super(editor);
        this.socket = socket;
        this.wire = new Wire(socket, undefined);
        this.wire.endPosition = editor.cursor.position;
        editor.world.addToWorld(this.wire);
    }

    onEvent(event) {
        if (event instanceof KeyEvent) {
            if (event.event === 'KEY_RELEASE' && event.keyCode === 8) {
                this.wire.removeWaypoint();
            }
            if (event.event === 'KEY_RELEASE' && event.keyCode === 27) {
                this.editor.world.removeFromWorld(this.wire);
                this.nextState = new DefaultState(this.editor);
                return;
            }
        }
        if (event instanceof MouseEvent) {
            if (event.event === 'MOUSE_UP') {
                const position = this.editor.cursor.position;
                const colliders = this.editor.collisionManager.collidingWith(position).map((collider) => collider.gameObject);
                const inputSocket = colliders.find((collider) => collider instanceof InputSocket);
                if (inputSocket) {
                    this.wire.input = inputSocket;
                    this.nextState = new DefaultState(this.editor);
                    return;
                } else {
                    const position = this.editor.grid.snapToGrid(this.editor.world.camera.positionInWorld(event.position), GRID_SIZE);
                    this.wire.addWaypoint(position);
                }
            }

            if (event.event === 'MOUSE_MOVE') {
                this.wire.endPosition = this.editor.cursor.position;
            }
        }
    }
}
