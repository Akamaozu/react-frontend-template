const child_process = require('child_process')

module.exports = async_build

async function async_build() {
  return new Promise( (resolve, reject) => {
    child_process.exec('npm run build', (error, stdout, stderr) => {
      if (error) {
        console.log('action=build-app success=false')
        console.log('action=log-build-stdout entry="'+ stdout + '"')
        console.log('action=log-build-stderr entry="'+ stderr + '"')
        reject(error)
      }
      else resolve(true)
    })
  })
}
