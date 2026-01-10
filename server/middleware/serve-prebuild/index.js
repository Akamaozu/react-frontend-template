const path = require('path')
const utils = require('../../utils')

let prebuild_html
let getting_prebuild_html

module.exports = maybe_serve_prebuild

function maybe_serve_prebuild( req, res, next ){
  if (req.is_built === true) {
    // free memory ... don't need this anymore
    if (prebuild_html !== null) prebuild_html = null

    return next()
  }

  get_and_send_prebuild_html()
  async function get_and_send_prebuild_html() {
    if (prebuild_html) return res.send( prebuild_html )

    if (!getting_prebuild_html) {
      getting_prebuild_html = utils.fs.async_get_file( path.join( __dirname, '../../../public/pre-build.html' ))
      prebuild_html = await getting_prebuild_html
      getting_prebuild_html = null
    }

    else await getting_prebuild_html

    res.send( prebuild_html )
  }
}
