const { connection } = require('../database/connection');

class UserService {
    //get user by email
    static getByUserEmail = async (email) =>{
        const [user] = await db.promise().execute('SELECT * FROM users WHERE email = ?', [
            email
        ])
        return user[0]
    }
    
    //get active user
    static getActiveUser = async (email) => {
        let userData = new Promise((resolve, reject) => {
            try {
                connection.query("SELECT * FROM users WHERE email = ? AND `status`= 'active' ", [email], function (error, results, fields) {
                    if (error) return reject(error);
                    resolve(results)
                });
            }
            catch (error) {
                throw error;
            }
        });
        let result = await userData;
        return result[0];
    }

    //get all users
    static getAll = async () => {
        let userData = new Promise((resolve, reject) => {
            connection.query('select  id,name,dob,created_at,updated_at from `users`', function (error, results, fields) {
                if (error) return reject(error);
                resolve(results)
            });
        });
        let result = await userData;
        return result;
    }
    // get by id
    static getByid = async (id) => {
        let userData = new Promise((resolve, reject) => {
            connection.query('select id,name,dob,created_at,updated_at from `users` where id=?', [id], function (error, results, fields) {
                if (error) return reject(error);
                resolve(results)
            });
        });
        let result = await userData;
        return result;
    }
}

module.exports = { UserService };