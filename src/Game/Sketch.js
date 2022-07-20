import p5 from '../../libraries/p5.js';
import { Main } from './Main.js';

// setup, draw
const sketch = (p) => {
    window.sketch = p;
    window.p5 = p5;

    let game;

    p.setup = () => {
        p.createCanvas(window.innerWidth, window.innerHeight);
        p.frameRate(60);

        game = new Main();
        window.game = game;
        game.setup();
    };

    p.draw = () => {
        p.background(220);
        game.tick();
    };
};

new p5(sketch);
