const path = require('path')
const supe = require('supe')
const { spawn } = require('node:child_process')
const utils = require('../utils')

utils.env.load()

const { ENV_NAME } = process.env
const server_env = ENV_NAME?.toLowerCase().trim() === 'production'
  ? 'production'
  : 'development'

console.log(`action=start-server protocols=http env=${server_env}`)

if (server_env === 'production') {
  const supervisor = supe()

  supervisor.register( 'prod-server', path.join(__dirname, './index'))
  
  supervisor.hook.add( 'citizen-starting-env', 'whitelist-prod-server-env', (env, citizen_name) => {
    if (citizen_name !== 'prod-server') return env

    return {
      ENV_NAME,
      PORT: process.env.PORT,
    }
  })

  supervisor.start('prod-server');
}

else {
  const server = spawn('npm', ['run', 'start:dev'], { shell: true })

  server.on('error', (error) => {
    console.log( `[dev-server][error] ${error}` )
    throw error
  })

  server.stdout.on( 'data', (data) => {
    const output = data.toString().trim()
    console.log( `[dev-server] ${output}` )
  })

  server.stderr.on( 'data', (data) => {
    const error = data.toString().trim()
    console.log( `[dev-server][error] ${error}` )
  })
}
