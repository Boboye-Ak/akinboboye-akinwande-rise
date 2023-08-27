process.env.NODE_ENV = "test"
//const dotenvFlow = require("dotenv-flow")
//dotenvFlow.config({ path: ".env.test" })


const User = require("../../dist/models/Users").default
const Session = require("../../dist/models/Sessions").default
const File = require("../../dist/models/Files").default
const chai = require("chai")
const app = require("../../dist/index").default
const chaiHttp = require("chai-http")
const { clearCloudinaryFolder } = require("../../dist/configs/cloudinary")
const { credentials } = require("../credentials")
const expect = chai.expect
const should = chai.should()
chai.use(chaiHttp)
const clearDB = async () => {
    console.log(User)
    await User.destroy({ where: {} })
    await Session.destroy({ where: {} })
    await File.destroy({ where: {} })
    await clearCloudinaryFolder(process.env.CLOUDINARY_FOLDER_NAME)
}

let sessionCookie
before(async () => {
    console.log("Clearing DB before process")
    try {
        await clearDB()
    } catch (error) {
        console.error("Error clearing DB before process:", error)
    }
})

after(async () => {
    console.log("Clearing DB after process")
    try {
        await clearDB()
    } catch (error) {
        console.error("Error clearing DB after process:", error)
    }
})

describe("/api/auth", () => {
    describe("/api/auth/signup POST", () => {
        it("responds with 400 if credentials are incomplete", (done) => {
            chai.request(app)
                .post("/api/auth/signup")
                .send(credentials.admin1Credentials_incomplete)
                .end((err, res) => {
                    res.should.have.status(400)
                    expect(res.body.message).to.be.equal("Please enter full name, email, and password")
                    done()
                })

        })
        it("responds with 400 if password is weak", (done) => {
            chai.request(app)
                .post("/api/auth/signup")
                .send(credentials.admin1Credentials_weakPassword)
                .end((err, res) => {
                    res.should.have.status(400)
                    expect(res.body.message).to.be.equal("Password too weak. Password must contain uppercase, lowercase, numbers, symbol and at least 8 characters")
                    done()
                })

        })
        it("responds with 400 if email address is invalid", (done) => {
            chai.request(app)
                .post("/api/auth/signup")
                .send(credentials.admin1Credentials_invalidEmail)
                .end((err, res) => {
                    res.should.have.status(400)
                    expect(res.body.message).to.be.equal("Please enter a valid email address")
                    done()
                })
        })
        it("responds with 200 and creates new user if everything is fine", (done) => {
            chai.request(app)
                .post("/api/auth/signup")
                .send(credentials.admin1Credentials)
                .end((err, res) => {
                    res.should.have.status(200)
                    expect(res.body.message).to.be.equal("New User created successfully")
                    done()
                })
        })
        it("responds with 409 if duplicate data is sent", (done) => {
            chai.request(app)
                .post("/api/auth/signup")
                .send(credentials.admin1Credentials)
                .end((err, res) => {
                    res.should.have.status(409)
                    expect(res.body.message).to.be.equal("User with this email already exists")
                    done()
                })
        })
    })
    describe("api/auth/login POST", () => {
        it("should return 200 if email and password are correct", (done) => {
            chai.request(app)
                .post("/api/auth/login")
                .send(credentials.admin1Credentials)
                .end((err, res) => {
                    res.should.have.status(200)
                    expect(res.body.message).to.be.equal("Successfully Authenticated")
                    done()
                })
        })
        it("should return 404 when email or password is wrong", (done) => {
            chai.request(app)
                .post("/api/auth/login")
                .send(credentials.admin1Credentials_wrongPassword)
                .end((err, res) => {
                    res.should.have.status(404)
                    expect(res.body.message).to.be.equal("Could not login. Check email address and password")
                    done()
                })
        })
    })

    describe("api/auth/myuser GET", () => {
        it("responds with 401 if user is not logged in", (done) => {
            chai.request(app)
                .get("/api/auth/myuser")
                .end((err, res) => {
                    res.should.have.status(401)
                    expect(res.body.message).to.be.equal("Authentication is needed")
                    done()
                })
        })
        it("responds with 200 if user is logged in", (done) => {
            chai.request(app)
                .post("/api/auth/login")
                .send(credentials.admin1Credentials)
                .end((err, res) => {
                    sessionCookie = res.headers["set-cookie"][0].split(";")[0]
                    chai.request(app)
                        .get("/api/auth/myuser")
                        .set("Cookie", sessionCookie)
                        .end((err, res) => {
                            res.should.have.status(200)
                            done()
                        })
                })
        })
    })
    describe("/api/auth/logout POST", () => {
        it("Revokes the user's session", (done) => {
            chai.request(app)
                .post("/api/auth/logout")
                .set("Cookie", sessionCookie)
                .end((err, res) => {
                    chai.request(app)
                        .get("/api/auth/myuser")
                        .set("Cookie", sessionCookie)
                        .end((err, res) => {
                            res.should.have.status(401)
                            done()
                        })
                })

        })

    })
})
