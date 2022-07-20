export class ElectronicsManager {
    constructor() {
        this.refreshRate = 2;
        this.electronics = [];
    }

    add(electronic) {
        this.electronics.push(electronic);
    }

    update() {
        if (sketch.frameCount % this.refreshRate === 0) {
            // this.electronics.forEach((electronic) => {
            //     electronic.prepareState();
            // });
            this.electronics.forEach((electronic) => {
                electronic.updateState();
            });
        }
    }
}
