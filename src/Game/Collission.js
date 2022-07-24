export class CollisionManager {
    constructor() {
        this.colliders = [];
        this.mouseOverColliders = [];
    }

    add(collider) {
        this.colliders.push(collider);
    }

    remove(collider) {
        this.colliders.splice(this.colliders.indexOf(collider), 1);
    }

    collidingWith(position) {
        const colliders = this.colliders.filter((collider) => {
            return collider.isColliding(position);
        });
        return colliders;
    }

    mouseMove(position) {
        const colliders = this.collidingWith(position);

        const mouseEnterColliders = colliders.filter((collider) => this.mouseOverColliders.includes(collider));
        const mouseLeaveColliders = this.mouseOverColliders.filter((collider) => !colliders.includes(collider));

        mouseLeaveColliders.forEach((collider) => collider.onMouseLeave());
        mouseEnterColliders.forEach((collider) => collider.onMouseEnter());

        this.mouseOverColliders = colliders;
    }
}

export class Collider {
    constructor(gameObject) {
        this.gameObject = gameObject;
        game.collisionManager.add(this);
    }

    get position() {
        return this.gameObject.getGlobalPosition();
    }

    remove() {
        game.collisionManager.remove(this);
    }

    onMouseEnter() {}
    onMouseLeave() {}
}

export class ColliderBox extends Collider {
    constructor(gameObject, dimension) {
        super(gameObject);
        this.dimension = dimension;
    }

    // works with rectmode center
    // sketch.rectMode()._renderer._rectMode = 'center'
    isColliding(position) {
        const isColliding =
            position.x > this.position.x - this.dimension.width * 0.5 &&
            position.x < this.position.x + this.dimension.width * 0.5 &&
            position.y > this.position.y - this.dimension.height * 0.5 &&
            position.y < this.position.y + this.dimension.height * 0.5;

        return isColliding;
    }
}

// export class ColliderCircle extends Collider {
//     constructor(gameObject, radius) {
//         super(gameObject);
//         this.radius = radius;
//     }

//     isColliding(position) {
//         return position.dist(this.position) < this.radius;
//     }
// }

export class Dimension {
    constructor(w, h) {
        this.width = w;
        this.height = h;
    }
}
