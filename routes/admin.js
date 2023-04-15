const express = require("express");
const router = express.Router();

const productHelper = require("../helpers/product-helpers");
const bodyParser = require("body-parser");
const productHelpers = require("../helpers/product-helpers");
const adminHelpers = require("../helpers/adminHelpers");
const userHelpers = require("../helpers/user-helpers");

router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", async (req, res) => {
    if (req.session.adminLoggedIn) {
        const users = await adminHelpers.getUsers();
        res.render("admin/adminUserView", {
            adminName: req.session.admin.name,
            users,
            admin: true,
        });
    } else {
        res.redirect("/admin/login");
    }
});

router.get("/login", (req, res) => {
    if (req.session.adminLoggedIn) {
        res.redirect("/admin");
    } else {
        res.render("admin/adminLogin", {
            passErr: req.session.passErr,
            admin: true,
            emailErr: req.session.emailErr,
        });
        req.session.passErr = false;
        req.session.emailErr = false;
    }
});

router.post("/login", (req, res) => {
    adminHelpers.adminLogin(req.body).then((response) => {
        if (response.status === "Invalid Email") {
            req.session.emailErr = response.status;
            req.session.passErr = response.passErr;
            res.redirect("/admin/login");
        } else if (response.status === "Invalid Password") {
            req.session.passErr = response.status;
            res.redirect("/admin/login");
        } else {
            req.session.admin = response.admin;
            req.session.adminLoggedIn = true;
            res.redirect("/admin");
        }
    });
});

router.post("/addUser", (req, res) => {
    if (req.session.adminLoggedIn) {
        userHelpers
            .doSignup(req.body)
            .then(() => {
                res.redirect("back");
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        res.redirect("/admin/login");
    }
});

router.post("/edituser/:id", (req, res) => {
    if (req.session.adminLoggedIn) {
        const userId = req.params.id;
        adminHelpers
            .editUser(userId, req.body)
            .then(() => {
                res.redirect("/admin");
            })
            .catch(() => {
                res.redirect("/admin");
            });
    } else {
        res.redirect("/admin/login");
    }
});

router.post("/suser", (req, res) => {
    if (req.session.adminLoggedIn) {
        console.log(req.body.name);
        adminHelpers
            .searchUser(req.body.name)
            .then((users) => {
                res.render("admin/adminUserView", { users });
            })
            .catch((err) => {
                res.render("admin/adminUserView", { err });
            });
    } else {
        res.redirect("/");
    }
});

router.get("/deleteUser/:id", (req, res) => {
    if (req.session.adminLoggedIn) {
        const userId = req.params.id;
        adminHelpers
            .deleteUser(userId)
            .then(() => {
                res.redirect("/admin");
            })
            .catch(() => {
                res.redirect("/admin");
            });
    } else {
        res.redirect("/admin/login");
    }
});

router.get("/Logout", (req, res) => {
    req.session.adminLoggedIn = false;
    req.session.admin = false;
    res.redirect("/admin/login");
});

module.exports = router;
