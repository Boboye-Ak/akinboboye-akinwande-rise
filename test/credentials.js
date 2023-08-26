module.exports.credentials = {
    admin1Credentials: {
        full_name: "John Doe",
        email: "joedoe@gmail.com",
        password: "$StrongPassword1234"
    },
    admin1Credentials_invalidEmail: {
        full_name: "John Doe",
        email: "joedoegmail.com",
        password: "$StrongPassword1234"
    },
    admin1Credentials_weakPassword: {
        full_name: "John Doe",
        email: "joedoe.gmail.com",
        password: "weakpass"

    },
    admin1Credentials_wrongPassword: {
        email: "joedoe@gmail.com",
        password: "$WrongPassword1234"
    },
    admin1Credentials_incomplete: {
        full_name: "John Doe",
        email: "joedoe.gmail.com"
    },
    admin2Credentials: {
        full_name: "admin two",
        email: "admintwo@gmail.com",
        password: "$Strongpassword123"
    },
    intruderCredentials: {
        email: "intruder@gmail.com",
        password: "#Intruderpassword123",
        full_name: "intruder intruder"
    }
}

module.exports.testFileName = "test_file.txt"
module.exports.folderName = "my docs"
module.exports.testMediaFileName = "test_video_file.mp4"
module.exports.mediaFolderName = "my videos"