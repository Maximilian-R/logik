import { EditorState } from './EditorState';
import { Socket } from '../../Electronics/Socket';
import { MouseEvent } from '../../../Utilities/Input';
import { MoveItemState } from './MoveItemState';
import { Item } from '../../Electronics/Item';
import { ModifyWireState } from './ModifyWire';

export class DefaultState extends EditorState {
    constructor(editor) {
        super(editor);
    }

    onEvent(event) {
        if (event instanceof MouseEvent) {
            if (event.event === 'MOUSE_UP') {
                const position = this.editor.cursor.position;
                const colliders = this.editor.collisionManager.collidingWith(position).map((collider) => collider.gameObject);

                const socket = colliders.find((collider) => collider instanceof Socket);
                if (socket) {
                    this.nextState = new ModifyWireState(this.editor, socket);
                }
            }

            if (event.event === 'MOUSE_DOWN') {
                const position = this.editor.cursor.position;
                const colliders = this.editor.collisionManager.collidingWith(position).map((collider) => collider.gameObject);

                const item = colliders.find((collider) => collider instanceof Item);
                if (item) {
                    this.nextState = new MoveItemState(this.editor, item);
                }
            }
        }
    }
}
