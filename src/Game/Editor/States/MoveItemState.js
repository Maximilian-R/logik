import { EditorState } from './EditorState';
import { MouseEvent } from '../../../Utilities/Input';
import { DefaultState } from './Default';

export class MoveItemState extends EditorState {
    constructor(editor, item) {
        super(editor);
        this.item = item;
        this.editor.openGUI(this.item);
        this.startingPosition = this.item.position;
    }

    onEvent(event) {
        if (event instanceof MouseEvent) {
            if (event.event === 'MOUSE_MOVE' || event.event === 'MOUSE_DRAG') {
                const position = this.editor.cursor.position;
                this.item.position = position;
            }
            if (event.event === 'MOUSE_UP') {
                const colliders = this.editor.collisionManager
                    .collidingWith(this.item.position)
                    .filter((collider) => collider != this.item.collider);
                if (colliders.length > 0) {
                    this.item.position = this.startingPosition;
                }
                this.nextState = new DefaultState(this.editor);
            }
        }
    }
}
