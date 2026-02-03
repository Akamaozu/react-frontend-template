const path = require('path')
const supe = require('supe')
const { spawn } = require('node:child_process')
const utils = require('../utils')

utils.env.load()

const { ENV_NAME } = process.env
const server_env = ENV_NAME?.toLowerCase().trim() === 'production'
  ? 'production'
  : 'development'

console.log( `action=start-server protocols=http env=${server_env}` )

if (server_env === 'production') {
  const supervisor = supe()
  const citizen_name = 'prod-server'
  const max_crashes = 3
  const max_crash_duration_mins = 1

  supervisor.register( citizen_name, path.join(__dirname, './index'), { retries: max_crashes, duration: max_crash_duration_mins })
  
  supervisor.hook.add( 'citizen-starting-env', `whitelist-${citizen_name}-env`, (start_env, citizen_started) => {
    if (citizen_started !== citizen_name) return start_env

    return {
      ENV_NAME,
      PATH: process.env.PATH,
      PORT: process.env.PORT,
      SUPE_CITIZEN_NAME: start_env.SUPE_CITIZEN_NAME,
    }
  })
  console.log( `action=whitelist-startup-env citizen=${citizen_name} permitted=ENV_NAME,PATH,PORT,SUPE_CITIZEN_NAME` )

  supervisor.hook.add( 'citizen-excessive-crash', 'shutdown-server-supervisor', crashed_citizen => {
    if (crashed_citizen.name !== citizen_name) return

    console.log( `action=schedule-restart citizen=${citizen_name} reason="crashed excessively (${max_crashes} crashes in ${max_crash_duration_mins} min)"` )
    process.exit()
  })
  console.log( `action=setup-excessive-crash-behavior citizen=${citizen_name} behavior=shutdown crashes=${ max_crashes } duration=${ max_crash_duration_mins }min` )

  supervisor.start('prod-server')
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
