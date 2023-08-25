process.env.NODE_ENV = "test"
//const dotenvFlow = require("dotenv-flow")
//dotenvFlow.config({ path: ".env.test" })
const { credentials, testFileName, folderName } = require("../credentials")

const User = require("../../dist/models/Users").default
const Session = require("../../dist/models/Sessions").default
const File = require("../../dist/models/Files").default
const chai = require("chai")
const app = require("../../dist/index").default
const chaiHttp = require("chai-http")
const { clearCloudinaryFolder } = require("../../dist/configs/cloudinary")
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const expect = chai.expect
const should = chai.should()
chai.use(chaiHttp)

let admin1sessionCookie, admin2sessionCookie, intruderSessionCookie, fileId

const testFilePath = path.join(__dirname, testFileName);
const formData = new FormData();

describe("/admin", () => {
    before((done) => {
        //make admins
        User.update({ isAdmin: true }, { where: { email: credentials.admin1Credentials.email } })
            .then(() => {
                chai.request(app)
                    .post("/auth/signup")
                    .send(credentials.admin2Credentials)
                    .end((err, res) => {
                        admin2sessionCookie = res.headers["set-cookie"][0].split(";")[0]
                        User.update({ isAdmin: true }, { where: { email: credentials.admin2Credentials.email } })
                            .then(() => {
                                chai.request(app)
                                    .post("/auth/login")
                                    .send(credentials.intruderCredentials)
                                    .end((err, res) => {
                                        intruderSessionCookie = res.headers["set-cookie"][0].split(";")[0]
                                        chai.request(app)
                                            .post("/auth/login")
                                            .send(credentials.admin1Credentials)
                                            .end((err, res) => {
                                                admin1sessionCookie = res.headers["set-cookie"][0].split(";")[0]
                                                chai.request(app)
                                                    .post("/files/upload")
                                                    .set("Content-Type", formData.getHeaders()["content-type"])
                                                    .attach("file", fs.readFileSync(testFilePath), testFileName)
                                                    .field("folderName", folderName)
                                                    .set("Cookie", admin1sessionCookie)
                                                    .end((err, res) => {
                                                        fileId = res.body.id
                                                        done()
                                                    })
                                            })
                                    })
                            })
                    })
            })
    })


    describe("/files/flag", () => {
        it("responds with 404 if file does not exist", (done) => {
            const invalidFileId = 9999
            chai.request(app)
                .put(`/files/flag/${invalidFileId}`)
                .set("Cookie", admin1sessionCookie)
                .end((err, res) => {
                    res.should.have.status(404)
                    expect(res.body.message).to.be.equal("File not found")
                    done()
                })
        })
        it("responds with 401 non admin tries to flag", (done) => {
            chai.request(app)
                .put(`/files/flag/${fileId}`)
                .set("Cookie", intruderSessionCookie)
                .end((err, res) => {
                    res.should.have.status(401)
                    expect(res.body.message).to.be.equal("Admin privileges are required")
                    done()
                })
        })
        it("responds with 200 if file is flagged successfully", (done) => {
            chai.request(app)
                .put(`/files/flag/${fileId}`)
                .set("Cookie", admin1sessionCookie)
                .end((err, res) => {
                    res.should.have.status(200)
                    expect(res.body.message).to.be.equal("File Flagged Successfully")
                    done()
                })
        })
        it("deletes the file from the server if flagged by two different admins", (done) => {
            chai.request(app)
                .put(`/files/flag/${fileId}`)
                .set("Cookie", admin2sessionCookie)
                .end((err, res) => {
                    res.should.have.status(200)
                    expect(res.body.message).to.be.equal("File Flagged Successfully")
                    expect(res.body.flaggedFile.isUploaded).to.be.equal(false)
                    expect(res.body.flaggedFile.isFlagged).to.be.equal(true)
                    done()
                })
        })
    })

})