process.env.NODE_ENV = "test"
//const dotenvFlow = require("dotenv-flow")
//dotenvFlow.config({ path: ".env.test" })
console.log(process.env.CLOUDINARY_FOLDER_NAME)
console.log(process.env.DB_NAME)

const User = require("../../dist/models/Users").default
const Session = require("../../dist/models/Sessions").default
const File = require("../../dist/models/Files").default
const chai = require("chai")
const app = require("../../dist/index").default
const chaiHttp = require("chai-http")
const { clearCloudinaryFolder } = require("../../dist/configs/cloudinary")

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

describe("/auth", () => {
    describe("/signup", () => {
        it("responds with 400 if credentials are incomplete", (done) => {
            const credentials = {
                full_name: "John Doe",
                email: "joedoe.gmail.com"
            }
            chai.request(app)
                .post("/auth/signup")
                .send(credentials)
                .end((err, res) => {
                    res.should.have.status(400)
                    expect(res.body.message).to.be.equal("Please enter full name, email, and password")
                    done()
                })

        })
        it("responds with 400 if password is weak", (done) => {
            const credentials = {
                full_name: "John Doe",
                email: "joedoe.gmail.com",
                password: "weakpass"
            }
            chai.request(app)
                .post("/auth/signup")
                .send(credentials)
                .end((err, res) => {
                    res.should.have.status(400)
                    expect(res.body.message).to.be.equal("Password too weak. Password must contain uppercase, lowercase, numbers, symbol and at least 8 characters")
                    done()
                })

        })
        it("responds with 400 if email address is invalid", (done) => {
            const credentials = {
                full_name: "John Doe",
                email: "joedoegmail.com",
                password: "$StrongPassword1234"
            }
            chai.request(app)
                .post("/auth/signup")
                .send(credentials)
                .end((err, res) => {
                    res.should.have.status(400)
                    expect(res.body.message).to.be.equal("Please enter a valid email address")
                    done()
                })
        })
        it("responds with 200 and creates new user if everything is fine", (done) => {
            const credentials = {
                full_name: "John Doe",
                email: "joedoe@gmail.com",
                password: "$StrongPassword1234"
            }
            chai.request(app)
                .post("/auth/signup")
                .send(credentials)
                .end((err, res) => {
                    res.should.have.status(200)
                    expect(res.body.message).to.be.equal("New User created successfully")
                    done()
                })
        })
        it("responds with 409 if duplicate data is sent", (done) => {
            const credentials = {
                full_name: "John Doe",
                email: "joedoe@gmail.com",
                password: "$StrongPassword1234"
            }
            chai.request(app)
                .post("/auth/signup")
                .send(credentials)
                .end((err, res) => {
                    res.should.have.status(409)
                    expect(res.body.message).to.be.equal("User with this email already exists")
                    done()
                })
        })
    })
    describe("/login", () => {
        it("should return 200 if email and password are correct", (done) => {
            const credentials = {
                email: "joedoe@gmail.com",
                password: "$StrongPassword1234"
            }
            chai.request(app)
                .post("/auth/login")
                .send(credentials)
                .end((err, res) => {
                    res.should.have.status(200)
                    expect(res.body.message).to.be.equal("Successfully Authenticated")
                    done()
                })
        })
        it("should return 404 when email or password is wrong", (done) => {
            const credentials = {
                email: "joedoe@gmail.com",
                password: "$WrongPassword1234"
            }
            chai.request(app)
                .post("/auth/login")
                .send(credentials)
                .end((err, res) => {
                    res.should.have.status(404)
                    expect(res.body.message).to.be.equal("Could not login. Check email address and password")
                    done()
                })
        })
    })

    describe("/myuser", () => {
        it("responds with 401 if user is not logged in", (done) => {
            chai.request(app)
                .get("/auth/myuser")
                .end((err, res) => {
                    res.should.have.status(401)
                    expect(res.body.message).to.be.equal("Authentication is needed")
                    done()
                })
        })
        it("responds with 200 if user is logged in", (done) => {
            const credentials = {
                email: "joedoe@gmail.com",
                password: "$StrongPassword1234"
            }
            chai.request(app)
                .post("/auth/login")
                .send(credentials)
                .end((err, res) => {
                    const sessionCookie = res.headers["set-cookie"][0].split(";")[0]
                    chai.request(app)
                        .get("/auth/myuser")
                        .set("Cookie", sessionCookie)
                        .end((err, res) => {
                            res.should.have.status(200)
                            done()
                        })
                })
        })
    })
})
