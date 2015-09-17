module.exports = function() {
  this.plugin(
    [
      require('./util/pattern'),
      require('./util/range'),
      require('./util/required'),
      require('./util/type')
    ]
  )
}
