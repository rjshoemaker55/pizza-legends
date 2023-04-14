class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {};
    this.cutsceneSpaces = config.cutsceneSpaces || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(this.lowerImage, utils.withGrid(10.5) - cameraPerson.x, utils.withGrid(6) - cameraPerson.y);
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(this.upperImage, utils.withGrid(10.5) - cameraPerson.x, utils.withGrid(6) - cameraPerson.y);
  }

  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach((key) => {
      let object = this.gameObjects[key];
      object.id = key;

      // later: determine if this object should actually mount
      object.mount(this);
    });
  }

  // Start a cutscene
  async startCutscene(events) {
    // Lets game objects know a cutscene is playing so they stop what they're doing
    this.isCutscenePlaying = true;

    // Loop through each cutscene event (passed in from overworld)
    for (let i = 0; i < events.length; i++) {
      // Instantiate a new OverWorldEvent for each event
      const event = new OverworldEvent({
        // Pass in the event and the map
        event: events[i],
        map: this
      });

      // Creates a new promise that will run the event, resolves once finished
      await event.init();
    }

    // Set isCutscenePlaying to false so objects can go back to normal behavior
    this.isCutscenePlaying = false;

    // Reset NPCs to do their idle behavior
    Object.values(this.gameObjects).forEach((object) => object.doBehaviorEvent(this));
  }

  checkForActionCutscene() {
    // Set the hero game object to const 'hero'
    const hero = this.gameObjects.hero;
    // Use the nextPosition util to find the hero's next position
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    // See if any game object's x and y values match up with the hero's next position,
    // and if so, set it to the const match
    const match = Object.values(this.gameObjects).find((object) => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`;
    });

    // if there is no cutscene playing, there is an interaction on the space in
    // front of the hero, and they have talking objects, start the cutscene
    if (!this.isCutscenePlaying && match && match.talking.length) {
      this.startCutscene(match.talking[0].events);
    }
  }

  checkForFootstepCutscene() {
    // set the hero game object to const 'hero'
    const hero = this.gameObjects['hero'];
    // see if there is a cutscene space where the hero is standing, and set it to 'match'
    const match = this.cutsceneSpaces[`${hero.x},${hero.y}`];

    // if there isnt a cutscene playing and there is a cutscene space wehre the hero
    // is standing, start the cutscene
    if (!this.isCutscenePlaying && match) {
      this.startCutscene(match[0].events);
    }
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
      npcA: new Person({
        x: utils.withGrid(7),
        y: utils.withGrid(9),
        src: 'images/characters/people/npc1.png',
        behaviorLoop: [
          { type: 'stand', direction: 'left', time: 800 },
          { type: 'stand', direction: 'up', time: 800 },
          { type: 'stand', direction: 'right', time: 1200 },
          { type: 'stand', direction: 'up', time: 300 }
        ],
        talking: [
          {
            events: [
              { type: 'textMessage', text: "I'm busy...", faceHero: 'npcA' },
              { type: 'textMessage', text: 'Go away!' },
              { who: 'npcA', type: 'walk', direction: 'right' },
              { who: 'hero', type: 'walk', direction: 'up' }
            ]
          }
        ]
      }),
      npcB: new Person({
        x: utils.withGrid(8),
        y: utils.withGrid(5),
        src: 'images/characters/people/npc2.png'
        // behaviorLoop: [
        //   { type: 'walk', direction: 'left' },
        //   { type: 'stand', direction: 'up', time: 800 },
        //   { type: 'walk', direction: 'up' },
        //   { type: 'walk', direction: 'right' },
        //   { type: 'walk', direction: 'down' }
        // ]
      })
    },
    walls: {
      [utils.asGridCoord(7, 6)]: true,
      [utils.asGridCoord(8, 6)]: true,
      [utils.asGridCoord(7, 7)]: true,
      [utils.asGridCoord(8, 7)]: true
    },
    cutsceneSpaces: {
      [utils.asGridCoord(7, 4)]: [
        {
          events: [
            { who: 'npcB', type: 'walk', direction: 'left' },
            { who: 'npcB', type: 'stand', direction: 'up', time: 500 },
            { type: 'textMessage', text: "You can't be in there!" },
            { who: 'npcB', type: 'walk', direction: 'right' },
            { who: 'npcB', type: 'stand', direction: 'down' },
            { who: 'hero', type: 'walk', direction: 'down' },
            { who: 'hero', type: 'walk', direction: 'left' }
          ]
        }
      ]
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
