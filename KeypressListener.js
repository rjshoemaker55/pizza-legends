class KeypressListener {
  constructor(keyCode, callback) {
    // Says were ready for a key to be pressed
    let keySafe = true;

    this.keydownFunction = function (event) {
      if (event.code === keyCode) {
        if (keySafe) {
          keySafe = false;
          callback();
        }
      }
    };

    this.keyupFunction = function (event) {
      if (event.code === keyCode) {
        keySafe = true;
      }
    };

    document.addEventListener('keydown', this.keydownFunction);
    document.addEventListener('keyup', this.keyupFunction);
  }

  unbind() {
    document.removeEventListener('keydown', this.keydownFunction);
    document.removeEventListener('keyup', this.keyupFunction);
  }
}
