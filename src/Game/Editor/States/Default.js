import { EditorState } from './EditorState';
import { OutputSocket } from '../../Electronics/Socket';
import { CreateWireState } from './CreateWire';
import { MouseEvent } from '../../../Utilities/Input';
import { MoveItemState } from './MoveItemState';
import { Item } from '../../Electronics/Item';

export class DefaultState extends EditorState {
    constructor(editor) {
        super(editor);
    }

    onEvent(event) {
        if (event instanceof MouseEvent) {
            if (event.event === 'MOUSE_UP') {
                const position = this.editor.cursor.position;
                const colliders = this.editor.collisionManager.collidingWith(position).map((collider) => collider.gameObject);

                const outputSocket = colliders.find((collider) => collider instanceof OutputSocket);
                if (outputSocket) {
                    this.nextState = new CreateWireState(this.editor, outputSocket);
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
