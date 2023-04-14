class TextMessage {
  constructor({ text, onComplete }) {
    this.text = text;
    this.onComplete = onComplete;
    this.element = null;
  }

  createElement() {
    // Create the element and add the class
    this.element = document.createElement('div');
    this.element.classList.add('TextMessage');

    // Add the html tags to the element, add the text that was passed in
    // from wherever TextMessage was created
    this.element.innerHTML = `
			<p class='TextMessage_p'>${this.text}</p>
			<button class='TextMessage_button'>Next</button>
		`;

    this.element.querySelector('button').addEventListener('click', () => {
      // Close the text message
      this.done();
    });

    this.actionListener = new KeypressListener('Enter', () => {
      this.actionListener.unbind();
      this.done();
    });
  }

  done() {
    this.element.remove();
    this.onComplete();
  }

  // Creates the element then appends it to whichever component was passed in
  // where init was run
  init(container) {
    this.createElement();
    container.appendChild(this.element);
  }
}
