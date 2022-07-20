export class Subject {
    constructor() {
        this.observerCollection = [];
    }

    registerObserver(obs, obsFunc) {
        this.observerCollection.push({ obj: obs, func: obsFunc });
    }

    unregisterObserver(obs) {
        const index = this.observerCollection.findIndex((obj) => obj === obs);
        if (index >= 0) this.observerCollection.splice(index, 1);
    }

    notifyObservers(event) {
        for (var obs of this.observerCollection) {
            // call on the given function, with the given object as 'this'
            // function.call(this, params);
            obs.func.call(obs.obj, event);
        }
    }
}

export class Event {
    constructor(event) {
        this.event = event;
    }
}
