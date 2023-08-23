const swaggerAutogen = require('swagger-autogen')()

const outputFile = './src/swagger_output.json'
const endpointsFiles = ['./src/index.js']

swaggerAutogen(outputFile, endpointsFiles,
    {
        host: "localhost:5000",
        schemes: ["http", "https"],
    })