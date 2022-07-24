import { Input } from '../Utilities/Input.js';
import { World } from './World';
import { Camera, CameraController } from './Camera.js';
import { ElectronicsManager } from './Electronics/ElectronicsManager.js';
import { CollisionManager } from './Collission.js';
import { Editor } from './Editor/Editor.js';
import { PathFinding } from './Pathfinding/PathFinding.js';

export class Main {
    constructor() {}

    loadScene() {}

    setup() {
        this.inputManager = new Input();
        this.gameCamera = new Camera();
        this.gameCameraController = new CameraController(this.inputManager, this.gameCamera);
        this.electronicsManager = new ElectronicsManager();
        this.collisionManager = new CollisionManager();
        this.world = new World(this.gameCamera);
        this.editor = new Editor(this.world, this.inputManager, this.collisionManager);

        this.pathFinding = new PathFinding();
    }

    tick() {
        this.gameCameraController.update();
        this.world.update();
        this.electronicsManager.update();
        this.editor.update();

        sketch.rectMode(sketch.CENTER);

        //sketch.push();
        this.gameCamera.draw();
        this.world.draw();
        this.editor.draw();
        //sketch.pop();

        this.pathFinding.draw();
    }
}
