class Listened {
  constructor(_track) {
    this.track = _track;
    this.quantity = 1;
  }

  count() {
    this.quantity++;
  }
}

module.exports = Listened;
