process.env.NODE_ENV = "test"

const User = require("../dist/models/Users")
const chai = require("chai")
const app = require("../dist/index")
const expect = chai.expect
const should = chai.should()
const chaiHttp = require("chai-http")

chai.use(chaiHttp)

before((done) => {
    console.log("clearing DB before testing")
    User.deleteMany({}).then(() => {
        done()
    })

})

after((done) => {
    console.log("clearing DB after testing")
    User.deleteMany({}).then(() => {
        done()
    })
})