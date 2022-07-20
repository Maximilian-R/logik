export class Electronic {
    constructor(onNextState) {
        this._currentState = new State(0);
        this._nextState;
        this._onNextState = onNextState;

        game.electronicsManager.add(this);
    }

    get power() {
        return this._currentState.power;
    }

    get isOn() {
        return this._currentState.power !== 0;
    }

    nextState(power) {
        this._nextState = new State(power);
    }

    updateState() {
        if (this._nextState) {
            this._currentState = this._nextState;
            this._nextState = null;
            this._onNextState?.(this._currentState);
        }
    }
}

export class State {
    constructor(power) {
        this.power = power;
        this.isOn = power !== 0;
    }
}
