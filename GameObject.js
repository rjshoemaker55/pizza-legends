class GameObject {
  constructor(config) {
    this.id = null;
    this.isMounted = false;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || 'down';
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src || '/images/characters/people/hero.png'
    });

    this.behaviorLoop = config.behaviorLoop || [];
    this.behaviorLoopIndex = 0;

    this.talking = config.talking || [];
  }

  mount(map) {
    this.isMounted = true;
    map.addWall(this.x, this.y);

    // If we have a behavior, kick off after a short delay
    setTimeout(() => {
      this.doBehaviorEvent(map);
    }, 10);
  }

  update() {}

  async doBehaviorEvent(map) {
    // Don't do anything if cutscene playing or no behavior loop or character is standing
    if (map.isCutscenePlaying || this.behaviorLoop.length === 0 || this.isStanding === true) {
      return;
    }

    // Setting up our event with relevant info
    let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
    eventConfig.who = this.id;

    // Create event instance from our next event config
    const eventHandler = new OverworldEvent({ map, event: eventConfig });
    await eventHandler.init();

    this.behaviorLoopIndex += 1;

    // Setting next event to fire
    if (this.behaviorLoopIndex === this.behaviorLoop.length) {
      this.behaviorLoopIndex = 0;
    }

    this.doBehaviorEvent(map);
  }
}
