const utils = require('../../utils')

let app_html
let getting_app_html = false

module.exports = serve_app_html

function serve_app_html( req, res, next ){
  if (app_html) return res.send(app_html)

  get_and_serve_app_html()
  async function get_and_serve_app_html() {
    if (!getting_app_html) {
      getting_app_html = utils.fs.async_get_file('./build/index.html')
      app_html = await getting_app_html
      getting_app_html = false
    }

    else await getting_app_html

    res.send(app_html)
  }
}
