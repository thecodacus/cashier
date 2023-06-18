use rusqlite::{params, Connection, Error};

use serde::{Deserialize, Serialize};
#[derive(Debug, Serialize, Deserialize)]
pub struct Customer {
    phone: i64,
    name: Option<String>,
}

impl Customer {
    pub fn save(&self, conn: &Connection) {
        conn.execute(
            "INSERT OR REPLACE INTO customers (phone, name) VALUES (?, ?)",
            params![self.phone, &self.name,],
        )
        .unwrap();
    }
    pub fn delete(&self, conn: &Connection) {
        conn.execute(
            "DELETE FROM customers WHERE phone = ?",
            params![&self.phone],
        )
        .unwrap();
    }

    pub fn setup_db(conn: &Connection) {
        print!("calling setup db \n");
        let sql: &str = "
            CREATE TABLE IF NOT EXISTS customers (
                phone INTEGER PRIMARY KEY,
                name TEXT NOT NULL
            );
        ";
        let params: () = ();
        let _result = conn.execute(sql, params).unwrap();
        print!("setup db: [create customers table] {_result}\n");
    }
}

pub fn get_all_customers(con: &Connection) -> Vec<Customer> {
    let result: std::result::Result<rusqlite::Statement, Error> =
        con.prepare("SELECT phone,name FROM customers");
    let mut query: rusqlite::Statement = result.unwrap();

    let item_iter = query
        .query_map([], |row| {
            Ok(Customer {
                phone: row.get(0)?,
                name: row.get(1)?,
            })
        })
        .unwrap();

    let mut result: Vec<Customer> = Vec::new();
    for item in item_iter {
        let item_data = item.unwrap();
        println!("Found person {:?}", item_data);
        result.push(item_data);
    }
    return result;
}

pub fn get_customers_by_phone(phone: i64, con: &Connection) -> Option<Customer> {
    let result: std::result::Result<rusqlite::Statement, Error> =
        con.prepare("SELECT phone,name FROM customers where phone=?");
    let mut query: rusqlite::Statement = result.unwrap();

    let item_iter = query
        .query_map([phone], |row| {
            Ok(Customer {
                phone: row.get(0)?,
                name: row.get(1)?,
            })
        })
        .unwrap();

    let mut customer: Option<Customer> = None;
    for result in item_iter {
        customer = Some(result.unwrap());
        break; // Assuming you only expect one result, exit the loop after the first iteration
    }

    customer
}
