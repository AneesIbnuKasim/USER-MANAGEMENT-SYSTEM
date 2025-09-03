const isLogin = (req, res, next) =>{
    try {
        if (req.session.userId) {}
        else {
            return res.redirect('/api/user/login')
        }
        next()
    } catch (error) {
        console.log(error.message);
    }
}
const isLogout = (req, res, next) =>{
    try {
        if (req.session.userId) {
            return res.redirect("/api/user/home")
        }
        next()
    } catch (error) {
        console.log(error.message);
        
    }
}

module.exports = {
    isLogin,
    isLogout
}