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


let sessionCookie, fileId, intruderSessionCookie





const testFilePath = path.join(__dirname, testFileName);
const formData = new FormData();



describe("/files", () => {
    before((done) => {
        console.log("login users")
        chai.request(app)
            .post("/auth/login")
            .send(credentials.admin1Credentials)
            .end((err, res) => {
                sessionCookie = res.headers["set-cookie"][0].split(";")[0]
                chai.request(app)
                    .post("/auth/signup")
                    .send(credentials.intruderCredentials)
                    .end((err, res) => {
                        intruderSessionCookie = res.headers["set-cookie"][0].split(";")[0]
                        done()
                    })
            })
    })

    describe("/upload", () => {
        it("responds with 400 if no file is uploaded", (done) => {
            chai.request(app)
                .post("/files/upload")
                .set("Cookie", sessionCookie)
                .end((err, res) => {
                    res.should.have.status(400)
                    expect(res.body.message).to.be.equal("Please upload file as form data")
                    done()
                })
        })
        it("responds with 200 if file is uploaded successfully", (done) => {
            chai.request(app)
                .post("/files/upload")
                .set("Content-Type", formData.getHeaders()["content-type"])
                .attach("file", fs.readFileSync(testFilePath), testFileName)
                .field("folderName", folderName)
                .set("Cookie", sessionCookie)
                .end((err, res) => {
                    res.should.have.status(200)
                    expect(res.body.message).to.be.equal("New file uploaded successfully")
                    fileId = res.body.id
                    done()
                })
        })
    })
    describe("/ get file list", () => {
        it("responds with an array of files", (done) => {
            chai.request(app).get("/files")
                .set("Cookie", sessionCookie)
                .end((err, res) => {
                    res.should.have.status(200)
                    expect(res.body).to.be.an("array")
                    done()
                })
        })
    })
    describe("/ get file data", () => {
        it("responds with 401 if intruder tries to access file", (done) => {
            chai.request(app).get(`/files/file/${fileId}`)
                .set("Cookie", intruderSessionCookie)
                .end((err, res) => {
                    res.should.have.status(401)
                    expect(res.body.message).to.be.equal("Unauthorized! Sign in as admin or file owner")
                    done()
                })
        })
        it("responds with 404 if file is not found", (done) => {
            const invalidFileId = 9999
            chai.request(app).get(`/files/file/${invalidFileId}`)
                .set("Cookie", sessionCookie)
                .end((err, res) => {
                    res.should.have.status(404)
                    expect(res.body.message).to.be.equal("File not found.")
                    done()
                })
        })
        it("responds with a file object", (done) => {
            chai.request(app).get(`/files/file/${fileId}`)
                .set("Cookie", sessionCookie)
                .end((err, res) => {
                    res.should.have.status(200)
                    expect(res.body).to.be.an("object")
                    expect(res.body.id).to.be.equal(fileId)
                    done()
                })
        })
    })
    describe("/folders get folder list", () => {
        it("responds with an array", (done) => {
            chai.request(app)
                .get("/files/folders")
                .set("Cookie", sessionCookie).end((err, res) => {
                    res.should.have.status(200)
                    expect(res.body).to.be.an("array")
                    expect(res.body[0]).to.be.equal(folderName)
                    done()
                })
        })
    })
    describe("/folders add new folder", () => {
        it("responds with 400 if no folder name is passed", (done) => {
            chai.request(app)
                .post("/files/folders")
                .set("Cookie", sessionCookie)
                .end((err, res) => {
                    res.should.have.status(400)
                    expect(res.body.message).to.be.equal("Please enter folder name")
                    done()
                })
        })
        it("responds with 409 if folder name already exists", (done) => {
            const newFolderName = "new folder"
            chai.request(app)
                .post("/files/folders")
                .send({ folderName })
                .set("Cookie", sessionCookie)
                .end((err, res) => {
                    res.should.have.status(409)
                    expect(res.body.message).to.be.equal(`Folder named "${folderName}" already exists`)
                    done()
                })
        })
        it("responds with 200 if everything is fine", (done) => {
            const newFolderName = "new folder"
            chai.request(app)
                .post("/files/folders")
                .send({ folderName: newFolderName })
                .set("Cookie", sessionCookie)
                .end((err, res) => {
                    res.should.have.status(200)
                    expect(res.body.message).to.be.equal(`Folder "${newFolderName}" added successfully`)
                    done()
                })
        })
    })
    describe("delete file", () => {
        it("responds with 404 if the file does not exist", (done) => {
            const nonExistentFileId = 9999
            chai.request(app)
                .delete(`/files/delete/${nonExistentFileId}`)
                .set("Cookie", sessionCookie)
                .end((err, res) => {
                    res.should.have.status(404)
                    expect(res.body.message).to.be.equal("File not found.")
                    done()
                })
        })
        it("responds with 401 if intruder tries to delete file", (done) => {
            chai.request(app)
                .delete(`/files/delete/${fileId}`)
                .set("Cookie", intruderSessionCookie)
                .end((err, res) => {
                    res.should.have.status(401)
                    expect(res.body.message).to.be.equal("Unauthorized! Sign in as file owner")
                    done()
                })
        })
        it("responds with 200 if everything goes fine", (done) => {
            chai.request(app)
                .delete(`/files/delete/${fileId}`)
                .set("Cookie", sessionCookie)
                .end((err, res) => {
                    res.should.have.status(200)
                    expect(res.body.message).to.be.equal("File Deleted Successfully")
                    done()
                })
        })

    })
})