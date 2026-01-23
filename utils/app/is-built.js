const path = require('path')
const async_path_exists = require('../fs/path-exists')

module.exports = async_is_built

async function async_is_built() {
  return async_path_exists( path.join(__dirname, '../../build/index.html') )
}
