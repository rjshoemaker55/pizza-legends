class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector('.game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.map = null;
  }

  startGameLoop() {
    const fps = 60;
    let now;
    let then = Date.now();
    let interval = 1000 / fps;
    let delta;

    const step = () => {
      // Clear canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Establish the camera person
      const cameraPerson = this.map.gameObjects.hero;

      // Update all objects
      Object.values(this.map.gameObjects).forEach((object) => {
        object.update({
          arrow: this.directionInput.direction,
          map: this.map
        });
      });

      // Draw Lower layer
      this.map.drawLowerImage(this.ctx, cameraPerson);

      // Draw all objects
      Object.values(this.map.gameObjects)
        .sort((a, b) => {
          return a.y - b.y;
        })
        .forEach((object) => {
          object.sprite.draw(this.ctx, cameraPerson);
        });

      // Draw upper layer
      this.map.drawUpperImage(this.ctx, cameraPerson);

      requestAnimationFrame(() => {
        step();
      });
    };

    step();
  }

  bindActionInput() {
    new KeypressListener('Enter', () => {
      // Is there a person here to talk to?
      this.map.checkForActionCutscene();
    });
  }

  bindHeroPositionCheck() {
    document.addEventListener('PersonWalkingComplete', (e) => {
      if (e.detail.whoId === 'hero') {
        // Hero's position has changed
        this.map.checkForFootstepCutscene();
      }
    });
  }

  init() {
    // Creates a new overworld map using the demo room map
    this.map = new OverworldMap(window.OverworldMaps.DemoRoom);
    // Mounts the objects on the map and adds "walls" where they are
    this.map.mountObjects();

    this.bindActionInput();
    this.bindHeroPositionCheck();

    // Instantiates a new directionInput object to take keybaord inputs
    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();

    // this.map.startCutscene([
    //   { who: 'hero', type: 'walk', direction: 'down' },
    //   { who: 'hero', type: 'walk', direction: 'down' },
    //   { who: 'hero', type: 'walk', direction: 'down' },
    //   { who: 'npcA', type: 'walk', direction: 'left' },
    //   { who: 'npcB', type: 'stand', direction: 'up' },
    //   { who: 'hero', type: 'stand', direction: 'right' },
    //   { type: 'textMessage', text: 'Why hello there!' }
    // ]);
  }
}
