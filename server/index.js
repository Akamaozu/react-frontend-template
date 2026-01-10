const utils = require('./utils')
const middleware = require('./middleware')

utils.env.load()

const server = utils.server.create()
const port = process.env.PORT ?? 3000

middleware.build_app.utils.async_check_and_maybe_build_app()

server.use( middleware.build_app )
server.use( middleware.serve_from_dir([ './public', './build' ]) )

server.get( '*', middleware.serve_prebuild, middleware.serve_app )

server.listen( port, () => {
  console.log(`action=server-listen port=${ port }`)
})
