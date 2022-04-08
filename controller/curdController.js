const controller = {};
const fs = require('fs');

controller.home = (req, res) => {
    req.getConnection((err, conn) => {
        return res.render('home');
    })
};
controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        let query = "SELECT * FROM `users` ORDER BY id ASC";
        conn.query(query, (err, data) => {
            if (err) {
                return res.json(err);
            }
            return res.render('index', {
                userList: data
            });
        });
    });
};

controller.add = (req, res) => {
    return res.render('add_user', {
        mode: 'add'
    });
};

controller.save = (req, res) => {
    req.getConnection((err, conn) => {

        let message = '';
        let profile_image = '';
        let name = req.body.name;
        let email = req.body.email;
        let genre = req.body.genre;
        let age = req.body.age;
        if (req.files) {
            let uploadedFile = req.files.profile_image;
            let img_name = image_name = uploadedFile.name;
            let fileExtension = uploadedFile.mimetype.split('/')[1];
            if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                profile_image = img_name;
                uploadedFile.mv(`public/uploads/images/${profile_image}`, (err) => {
                    if (err) {
                        return res.json(err);
                    }
                });
            } else {
                return res.redirect('/add?imageformat=error');
            }
        }
        let ckUser = "SELECT * FROM `users` WHERE `email` = '" + email + "'";
        conn.query(ckUser, (err, data) => {
            if (err) {
                return res.json(err);
            }
            if (data.length > 0) {
                return res.redirect('/add?user=exist');
            } else {
                let query = "INSERT INTO `users`(`name`, `email`, `image`, `age`, `genre`) VALUES('" + name + "', '" + email + "', '" + profile_image + "', '" + age + "', '"+ genre +"')";
                conn.query(query, (err, data) => {
                    if (err) {
                        return res.json(err);
                    }
                    return res.redirect('/index');
                });
            }
        });
    });
};


controller.edit = (req, res) => {
    let id = req.params.id;
    req.getConnection((err, conn) => {
        let query = "SELECT * FROM `users` WHERE `id` = '" + id + "'";
        conn.query(query, (err, data) => {
            if (err) {
                return res.json(err);
            }
            return res.render('add_user', {
                editUser: data[0],
                mode: 'edit'
            });
        });
    });
};


controller.update = (req, res) => {
    req.getConnection((err, conn) => {

        let message = '';
        let profile_image = req.body.current_profile_image;
        let id = req.params.id;
        let name = req.body.name;
        let email = req.body.email;
        let genre = req.body.genre;
        let age = req.body.age;
        if (req.files) {
            let uploadedFile = req.files.profile_image;
            let img_name = image_name = uploadedFile.name;
            let fileExtension = uploadedFile.mimetype.split('/')[1];
            if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                profile_image = img_name;
                uploadedFile.mv(`public/uploads/images/${profile_image}`, (err) => {
                    if (err) {
                        return res.json(err);
                    }
                });
            } else {
                return res.redirect('/add?imageformat=error');
            }
        }
        let ckUser = "SELECT * FROM `users` WHERE `email` = '" + email + "' AND `id` != '" + id + "'";
        conn.query(ckUser, (err, data) => {
            if (err) {
                return res.json(err);
            }
            if (data.length > 0) {
                return res.redirect('/edit/' + id + '?user=exist');
            } else {
                let query = "UPDATE `users` SET `name` = '" + name + "', `email` = '" + email + "', `age` = '" + age + "', `image` = '" + profile_image + "', `genre` = '" + genre + "' WHERE `id` = '" + id + "'";
                conn.query(query, (err, data) => {
                    if (err) {
                        return res.json(err);
                    }
                    return res.redirect('/index');
                });
            }
        });
    });
};

controller.delete = (req, res) => {
    let id = req.params.id;
    req.getConnection((err, conn) => {
        let query = "DELETE FROM `users` WHERE `id` = '" + id + "'";
        conn.query(query, (err, data) => {
            if (err) {
                return res.json(err);
            }
            return res.redirect('/index');
        });
    });
};

controller.deleteUserImage = (req, res) => {
    let id = req.params.id;
    req.getConnection((err, conn) => {
        let query = "UPDATE `users` SET `image` = '' WHERE `id` = '" + id + "'";
        conn.query(query, (err, data) => {
            if (err) {
                return res.json(err);
            }
            return res.redirect('back');
        });
    });
};
module.exports = controller;
