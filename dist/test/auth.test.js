"use strict";
process.env.NODE_ENV = "test";
const CLOUDINARY_FOLDER_NAME = process.env.CLOUDINARY_FOLDER_NAME;
const User = require("../src/models/Users");
const File = require("../src/models/Files");
const { Session } = require("../src/index");
const chai = require("chai");
const app = require("../dist/index");
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require("chai-http");
const { clearCloudinaryFolder } = require("../dist/configs/cloudinary");
chai.use(chaiHttp);
before((done) => {
    console.log("clearing DB before testing");
    console.log(User);
    User.destroyAll().then(() => {
        File.destroyAll().then(() => {
            Session.destroyAll().then(() => {
                clearCloudinaryFolder(CLOUDINARY_FOLDER_NAME).then(() => {
                    done();
                });
            });
        });
    });
});
after((done) => {
    console.log("clearing DB after testing");
    User.destroyAll().then(() => {
        File.destroyAll().then(() => {
            Session.destroyAll().then(() => {
                clearCloudinaryFolder(CLOUDINARY_FOLDER_NAME).then(() => {
                    done();
                });
            });
        });
    });
});
describe("/api/auth", () => {
    it("dummy test", (done) => {
    });
});
