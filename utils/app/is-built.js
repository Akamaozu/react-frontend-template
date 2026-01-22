const path = require('path')
const utils = require('../')

module.exports = async_is_built

async function async_is_built() {
  return utils.fs.async_path_exists( path.join(__dirname, '../../build/index.html') )
}
