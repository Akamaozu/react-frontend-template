const utils = require('../../utils')

module.exports = maybe_build_app

maybe_build_app.utils = {
  async_is_app_built: is_app_built,
  async_check_and_maybe_build_app: check_and_maybe_build_app,
}

let is_built
let building = false
let checking_is_built = false

function maybe_build_app( req, res, next ){
  req.is_built = is_built

  if (!checking_is_built && !is_built) check_and_maybe_build_app()

  return next()
}

async function check_and_maybe_build_app() {
  if (is_built || checking_is_built) return

  checking_is_built = true
  is_built = await is_app_built()
  checking_is_built = false

  if (!is_built) {
    if (building) return

    building = true
    await build_app()
    building = false
  }

  is_built = true
}

async function is_app_built() {
  const is_built = await utils.app.async_is_built()
  console.log(`action=check-is-app-built result=${ is_built }`)

  return is_built
}

async function build_app() {
  const build_app = await utils.app.async_build()
  console.log('action=build-app success=true')
}
