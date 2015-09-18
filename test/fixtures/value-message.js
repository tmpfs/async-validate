// an error message with the array index is not very useful
// in this instance use the value instead
function value(message, parameters) {
  parameters[0] = this.value;
  return this.format.apply(this, [message].concat(parameters));
}

module.exports = value;
