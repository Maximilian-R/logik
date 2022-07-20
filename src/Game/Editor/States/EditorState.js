export class EditorState {
    constructor(editor) {
        this.editor = editor;
    }
    onEvent(event) {}
    onEnter() {}
    onExit() {}
    update() {
        if (this.nextState) {
            return this.nextState;
        }
    }
}
