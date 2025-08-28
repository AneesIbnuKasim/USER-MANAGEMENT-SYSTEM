const isLogin = (req, res, next) =>{
    try {
        if (req.session.user_id) {}
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
        if (req.session.user_id) {
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