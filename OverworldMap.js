class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
    );
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
    );
  }

  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.values(this.gameObjects).forEach((o) => {
      // later: determine if this object should actually mount
      o.mount(this);
    });
  }

  addWall(x, y) {
    this.walls[`${x},${y}`] = true;
  }

  removeWall(x, y) {
    delete this.walls[`${x},${y}`];
  }

  moveWall(oldX, oldY, direction) {
    this.removeWall(oldX, oldY);
    const { x, y } = utils.nextPosition(oldX, oldY, direction);
    this.addWall(x, y);
  }
}

window.OverworldMaps = {
  DemoRoom: {
    lowerSrc: 'images/maps/DemoLower.png',
    upperSrc: 'images/maps/DemoUpper.png',
    gameObjects: {
      hero: new Person({
        x: utils.withGrid(5),
        y: utils.withGrid(6),
        isPlayerControlled: true
      }),
      npc1: new Person({
        x: utils.withGrid(7),
        y: utils.withGrid(9),
        src: 'images/characters/people/npc1.png'
      })
    },
    walls: {
      [utils.asGridCoord(7, 6)]: true,
      [utils.asGridCoord(8, 6)]: true,
      [utils.asGridCoord(7, 7)]: true,
      [utils.asGridCoord(8, 7)]: true
    }
  },
  Kitchen: {
    lowerSrc: 'images/maps/KitchenLower.png',
    upperSrc: 'images/maps/KitchenUpper.png',
    gameObjects: {
      hero: new Person({
        x: utils.withGrid(3),
        y: utils.withGrid(7),
        isPlayerControlled: true
      }),
      npcA: new GameObject({
        x: utils.withGrid(9),
        y: utils.withGrid(6),
        src: 'images/characters/people/npc1.png'
      }),
      npcB: new GameObject({
        x: utils.withGrid(10),
        y: utils.withGrid(4),
        src: 'images/characters/people/npc2.png'
      })
    }
  }
};
