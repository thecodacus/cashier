use crate::modules::auth::get_str_hash;

use super::role::Role;

use rusqlite::{params, Connection, Error};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub id: Option<String>,
    pub first_name: String,
    pub last_name: String,
    pub password: Option<String>,
    pub role: Role,
}

impl User {
    pub fn save(&self, conn: &Connection) -> Result<(), Error> {
        conn.execute(
            "INSERT INTO users (id, first_name, last_name, password, role) 
             VALUES (?, ?, ?, ?, ?)
             ON CONFLICT(id) DO UPDATE SET 
             first_name = excluded.first_name, 
             last_name = excluded.last_name, 
             password = excluded.password, 
             role = excluded.role",
            params![
                &self.id,
                &self.first_name,
                &self.last_name,
                &self.password,
                &self.role,
            ],
        )?;

        Ok(())
    }
    pub fn update(&self, conn: &Connection) -> Result<(), Error> {
        conn.execute(
            "UPDATE users SET 
             first_name = ?,
             last_name = ?,
             password = ?,
             role = ?
             WHERE id = ?",
            params![
                &self.first_name,
                &self.last_name,
                &self.password,
                &self.role,
                &self.id,
            ],
        )?;

        Ok(())
    }
    pub fn delete(&self, conn: &Connection) -> Result<(), Error> {
        conn.execute("DELETE FROM users WHERE id = ?", params![&self.id])?;

        Ok(())
    }
    pub fn setup_db(conn: &Connection) {
        print!("calling setup db \n");
        let sql: &str = "
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                first_name  TEXT NOT NULL,
                last_name TEXT NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL
            );
        ";
        let params: () = ();
        let _result = conn.execute(sql, params).unwrap();
        print!("setup db: [create users table] {_result}\n");
        let pass_hash = get_str_hash("admin");
        let _result = conn
            .execute(
                &format!(
                    "
                INSERT INTO users (id, first_name, last_name, password, role) 
                        VALUES ('admin', 'admin', 'admin', '{pass_hash}', 'admin')
                        ON CONFLICT(id) DO UPDATE SET 
                        first_name = excluded.first_name, 
                        last_name = excluded.last_name, 
                        password = excluded.password, 
                        role = excluded.role;
                "
                ),
                (),
            )
            .unwrap();
        print!("setup db: [create admin user] {_result}\n");
    }
}

pub fn get_all_users(con: &Connection) -> Vec<User> {
    let result: std::result::Result<rusqlite::Statement, Error> =
        con.prepare("SELECT id,first_name,last_name,role  FROM users");
    let mut query: rusqlite::Statement = result.unwrap();

    let user_iter = query
        .query_map([], |row| {
            Ok(User {
                id: row.get(0)?,
                first_name: row.get(1)?,
                last_name: row.get(2)?,
                role: row.get(3)?,
                password: None,
            })
        })
        .unwrap();

    let mut result: Vec<User> = Vec::new();
    for user in user_iter {
        let user_data = user.unwrap();
        println!("Found person {:?}", user_data);
        result.push(user_data);
    }
    return result;
}

pub fn get_user_by_id(id: &str, con: &Connection) -> Option<User> {
    let result: std::result::Result<rusqlite::Statement, Error> =
        con.prepare("SELECT id,first_name,last_name,role   FROM users where id=?");
    let mut query: rusqlite::Statement = result.unwrap();

    let user_iter = query
        .query_map([id], |row| {
            Ok(User {
                id: row.get(0)?,
                first_name: row.get(1)?,
                last_name: row.get(2)?,
                role: row.get(3)?,
                password: None,
            })
        })
        .unwrap();

    let mut user: Option<User> = None;
    for result in user_iter {
        user = Some(result.unwrap());
        break; // Assuming you only expect one result, exit the loop after the first iteration
    }

    user
}

pub fn authenticate_user(id: &str, password: &str, con: &Connection) -> bool {
    let result: std::result::Result<rusqlite::Statement, Error> =
        con.prepare("SELECT id,first_name,last_name,role ,password  FROM users where id=?");
    let mut query: rusqlite::Statement = result.unwrap();

    let user_iter = query
        .query_map([id], |row| {
            Ok(User {
                id: row.get(0)?,
                first_name: row.get(1)?,
                last_name: row.get(2)?,
                role: row.get(3)?,
                password: row.get(4)?,
            })
        })
        .unwrap();

    let mut user: Option<User> = None;
    for result in user_iter {
        user = Some(result.unwrap());
        break; // Assuming you only expect one result, exit the loop after the first iteration
    }
    if !user.is_some() {
        return false;
    }
    let data = user.unwrap();
    return data.password.unwrap() == password;
}
