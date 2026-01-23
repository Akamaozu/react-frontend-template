const compression = require('compression')
const os = require('node:os')
const utils = require('../utils')
const middleware = require('./middleware')

utils.env.load()

const server = utils.server.create()
const port = process.env.PORT ?? 3000

server.use( compression() )
console.log( 'action=setup-middleware behavior=compress-http-response encodings=gzip,brotli,deflate' )

server.use( middleware.build_app )
console.log( 'action=setup-middleware behavior=build-react-app' )

const dirs_to_serve = [ './public', './build' ]
server.use( middleware.serve_from_dir( dirs_to_serve ) )
console.log( `action=setup-middleware behavior=serve-from-fs dirs="${ dirs_to_serve.join('", "') }"` )

server.get( '*', middleware.serve_prebuild, middleware.serve_app )
console.log( 'action=setup-route-handler path=ALL method=GET behavior=serve-app-build-or-prebuild' )

server.listen( port, () => {
  const non_internal_ip4_interfaces = Object.values( os.networkInterfaces() )
    .flat()
    .filter(interface => {
      if (interface.internal) return false
      if (
        interface.family != 'IPv4'
        && interface.family != 4
      ) return false

      return true
    })

  console.log(`action=server-listen port=${ port }${ non_internal_ip4_interfaces.length > 0 && ` local=http://${ non_internal_ip4_interfaces[0].address }:${ port }` }`)

  middleware.build_app.utils.async_check_and_maybe_build_app()
  console.log( 'action=ensure-react-app-build-exists' )
})
