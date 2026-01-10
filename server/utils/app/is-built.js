module.exports = async_is_built

async function async_is_built() {
  const utils = require('../')
  return utils.fs.async_path_exists(__dirname + '/../../../build/index.html')
}
