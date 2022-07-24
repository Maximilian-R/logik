import { EditorState } from './EditorState';
import { GRID_SIZE, WIRE_DELETE_COLOR } from '../../Constants';
import { InputSocket, OutputSocket } from '../../Electronics/Socket';
import { KeyEvent, MouseEvent } from '../../../Utilities/Input';
import { Wire } from '../../Electronics/Wire';
import { DefaultState } from './Default';

export class ModifyWireState extends EditorState {
    constructor(editor, socket) {
        super(editor);
        this.targetInput;
        this.socket = socket;

        if (socket instanceof InputSocket) {
            this.wire = socket.wire;
            this.socket.disconnect(this.wire);
            this.wire.input = undefined;
        } else if (socket instanceof OutputSocket) {
            this.socket = socket;
            this.wire = new Wire(socket, undefined);
            editor.world.addToWorld(this.wire);
        }

        this.wire.endPosition = editor.cursor.position;
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
                    const waypoints = game.pathFinding.findShortestPath(
                        this.wire.waypoints.slice(-1)[0] ?? this.socket.getGlobalPosition(),
                        inputSocket.getGlobalPosition(),
                    );

                    // remove start and end
                    this.wire.addWaypoints(waypoints.slice(1, waypoints.length - 1));

                    if (inputSocket.hasConnection()) {
                        this.editor.world.removeFromWorld(inputSocket.wire);
                    }
                    this.wire.input = inputSocket;
                    this.nextState = new DefaultState(this.editor);
                    return;
                } else if (colliders.length === 0) {
                    const position = this.editor.grid.snapToGrid(this.editor.world.camera.positionInWorld(event.position), GRID_SIZE);
                    this.wire.addWaypoint(position);
                }
            }

            if (event.event === 'MOUSE_MOVE') {
                const position = this.editor.cursor.position;
                const colliders = this.editor.collisionManager.collidingWith(position).map((collider) => collider.gameObject);

                const collidingInput = colliders.find((collider) => collider instanceof InputSocket);
                if (collidingInput && !this.targetInput) {
                    this.targetInput = collidingInput;
                    if (this.targetInput.wire) {
                        this.targetInput.wire.customColor = WIRE_DELETE_COLOR;
                    }
                } else if (this.targetInput !== collidingInput) {
                    if (this.targetInput.wire) {
                        this.targetInput.wire.customColor = undefined;
                    }
                    this.targetInput = undefined;
                }

                const obstacles = colliders.filter((collider) => !(collider instanceof InputSocket));
                if (obstacles.length > 0) {
                    this.wire.customColor = WIRE_DELETE_COLOR;
                } else {
                    this.wire.customColor = undefined;
                }

                this.wire.endPosition = this.editor.cursor.position;
            }
        }
    }
}
