

const isLogin = async(req, res, next)=>{
    if(!req.session.adminId) {
        return res.redirect('/api/admin/login')
    }
    next()
}
const isLogout = async(req, res, next)=>{
    if(req.session.adminId) {
        return res.redirect('/api/admin/dashboard')
    }
    next()
}

module.exports = {
    isLogin,
    isLogout
}