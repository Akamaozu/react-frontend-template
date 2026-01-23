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
  const citizen_name = 'prod-server'

  supervisor.register( citizen_name, path.join(__dirname, './index'))
  
  supervisor.hook.add( 'citizen-starting-env', 'whitelist-prod-server-env', (start_env, citizen_started) => {
    if (citizen_started !== citizen_name) return start_env

    return {
      ENV_NAME,
      PORT: process.env.PORT,
      SUPE_CITIZEN_NAME: start_env.SUPE_CITIZEN_NAME,
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
