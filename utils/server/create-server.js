const express = require('express')

module.exports = create_server

function create_server() {
  const server = express()
  console.log('action=create-server framework=express')

  return server
}
