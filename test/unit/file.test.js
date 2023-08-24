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
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");

const expect = chai.expect
const should = chai.should()
chai.use(chaiHttp)

const clearDB = async () => {
    await User.destroy({ where: {} })
    await Session.destroy({ where: {} })
    await File.destroy({ where: {} })
    await clearCloudinaryFolder(process.env.CLOUDINARY_FOLDER_NAME)
}
let sessionCookie



const testFileName = "file_example_MP3_700KB.mp3"
const testFilePath = path.join(__dirname, testFileName);
const formData = new FormData();



describe("/files", () => {
    beforeEach((done) => {
        console.log("attempting login")
        const credentials = {
            email: "joedoe@gmail.com",
            password: "$StrongPassword1234"
        }
        chai.request(app)
            .post("/auth/login")
            .send(credentials)
            .end((err, res) => {
                sessionCookie = res.headers["set-cookie"][0].split(";")[0]
                console.log({ sessionCookie })
                console.log("logged in")
                done()
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
                .field("folderName", "my music")
                .set("Cookie", sessionCookie)
                .end((err, res) => {
                    console.log({ testFilePath, formData })
                    res.should.have.status(200)
                    expect(res.body.message).to.be.equal("New file uploaded successfully")
                    done()
                })
        })
    })
})