const Entity = require('./src/Entity');
const ECS = require('./src/ECS').getInstance();
const System = require('./src/System');

let player1 = Entity.create({position: {x: 0, y: 0, z: 0}});
let player2 = Entity.create({position: {x: 0, y: 0, z: 0}});
let player3 = Entity.create();
player1.registerComponent('speed', {
    x: 1,
    y: 0,
    z: 0,
});
player2.registerComponent('speed', {
    x: 1,
    y: 0,
    z: 0,
});
ECS.registerEntity(player1);
ECS.registerEntity(player2);
ECS.registerEntity(player3);

class MoveSystem extends System {
    constructor() {
        super('speed', 'position');
    }

    update(dt, entity) {
        let position = entity.position.x;
        entity.position.x += entity.speed.x * (dt / 1000);
        if (position !== entity.position.x) {
            entity.updated = true;
        }
    }

}

let moveSystem = new MoveSystem();
ECS.registerSystem(moveSystem);
const gameLoop = (first) => {
    ECS.update(first);
    setTimeout(gameLoop, 16 - ECS.updateTime);
};
gameLoop(true);
