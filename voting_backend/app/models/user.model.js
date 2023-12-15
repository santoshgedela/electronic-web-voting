const sql = require("./db.js");
const bcrypt = require('bcrypt');

// constructor
const User = function (user) {
  this.username = user.username;
  this.password = user.password;
  this.voter_id = user.voter_id;
  this.fullname = user.fullname;
  this.dob = user.dob;
  this.email_id = user.email_id;
  if (user.candidate == 1) {
    this.user_type = 3;
    this.candidate = 1;
  } else {
    this.user_type = 2;
  }
};

User.create = (newUser, result) => {
  sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created user: ", { id: res.insertId, ...newUser });
    result(null, { id: res.insertId, ...newUser });
  });
};

// Tutorial.findById = (id, result) => {
//   sql.query(`SELECT * FROM tutorials WHERE id = ${id}`, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(err, null);
//       return;
//     }

//     if (res.length) {
//       console.log("found tutorial: ", res[0]);
//       result(null, res[0]);
//       return;
//     }

//     // not found Tutorial with the id
//     result({ kind: "not_found" }, null);
//   });
// };*/

User.getAll = (username, result) => {
  let query = "SELECT * FROM users";

  if (username) {
    query += ` WHERE username LIKE '%${username}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("users: ", res);
    result(null, res);
  });
};

//OTP
User.getAllByUser = (email_id, password, result) => {
  // var otp = Math.floor(Math.random() * (10 - 1 + 1)) + 1;

  let query2 = `SELECT * from users WHERE email_id = '${email_id}'`;
  let user;
  sql.query(query2, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log("users: ", res);
    if (res.length) {
      user = res[0];
      // Compare the entered password with the hashed password stored in the database
      bcrypt.compare(password, user.password, (compareErr, passwordMatch) => {
        if (compareErr) {
          res.status(500).send({
            message: "Error comparing passwords.",
            error: compareErr.message || "Some error occurred.",
          });
          return;
        }

        if (passwordMatch) {
          var otp = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;
          user.otp = otp;
          let query1 = `UPDATE users set otp = ${otp} `;

          if (email_id && password) {
            query1 += ` WHERE email_id = '${email_id}'`;
          }

          sql.query(query1, (err, res) => {
            if (err) {
              console.log("error: ", err);
              result(null, err);
              return;
            }
            console.log("users: ", res);
            result(null, user);
          });
        } else {
          result(null, { message: "InvalidCredentials" });
        }
      });
    }
  });
};
/*
Tutorial.getAllPublished = result => {
  sql.query("SELECT * FROM tutorials WHERE published=true", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("tutorials: ", res);
    result(null, res);
  });
};

Tutorial.updateById = (id, tutorial, result) => {
  sql.query(
    "UPDATE tutorials SET title = ?, description = ?, published = ? WHERE id = ?",
    [tutorial.title, tutorial.description, tutorial.published, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Tutorial with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated tutorial: ", { id: id, ...tutorial });
      result(null, { id: id, ...tutorial });
    }
  );
};

Tutorial.remove = (id, result) => {
  sql.query("DELETE FROM tutorials WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Tutorial with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted tutorial with id: ", id);
    result(null, res);
  });
};

Tutorial.removeAll = result => {
  sql.query("DELETE FROM tutorials", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} tutorials`);
    result(null, res);
  });
};
*/
module.exports = User;
