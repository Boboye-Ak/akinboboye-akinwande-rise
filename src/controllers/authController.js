module.exports.signup_post=(req, res)=>{

}

module.exports.login_post=(req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        console.log(user)
        if (err) throw err
        if (!user)
            res.status(404).json({ message: "Could not login. Check email address and password" })
        else {
            req.logIn(user, (err) => {
                if (err) throw err
                console.log(req.user)
                res.status(200).json({ message: "Successfully Authenticated" })
            })
        }
    })(req, res, next)
}