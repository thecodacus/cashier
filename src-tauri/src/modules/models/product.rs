use rusqlite::{params, Connection, Error};

use serde::{Deserialize, Serialize};
#[derive(Debug, Serialize, Deserialize)]
pub struct Product {
    pub code: Option<String>,
    pub name: String,
    pub buyingPrice: f32,
    pub sellingPrice: f32,
    pub category: Option<String>,
    pub quantity: i32,
}

impl Product {
    pub fn save(&self, conn: &Connection) {
        conn.execute(
            "INSERT OR REPLACE INTO products (code, name, buyingPrice, sellingPrice, category, quantity) VALUES (?, ?, ?,?, ?, ?)",
            params![
                &self.code,
                &self.name,
                self.buyingPrice,
                self.sellingPrice,
                &self.category,
                &self.quantity
            ],
        ).unwrap();
    }
    pub fn delete(&self, conn: &Connection) {
        conn.execute("DELETE FROM products WHERE code = ?", params![&self.code])
            .unwrap();
    }
    pub fn setup_db(conn: &Connection) {
        print!("calling setup db \n");
        let sql: &str = "
            CREATE TABLE IF NOT EXISTS products (
                code TEXT PRIMARY KEY,
                name  TEXT NOT NULL,
                buyingPrice REAL NOT NULL,
                sellingPrice REAL NOT NULL,
                category TEXT NULL,
                quantity INTEGER NOT NULL
            );
        ";
        let params: () = ();
        let _result = conn.execute(sql, params).unwrap();
        print!("setup db: [create products table] {_result}\n");
    }
}

pub fn get_all_products(con: &Connection) -> Vec<Product> {
    let result: std::result::Result<rusqlite::Statement, Error> =
        con.prepare("SELECT code,name,buyingPrice,sellingPrice,category,quantity  FROM products");
    let mut query: rusqlite::Statement = result.unwrap();

    let product_iter = query
        .query_map([], |row| {
            Ok(Product {
                code: row.get(0)?,
                name: row.get(1)?,
                buyingPrice: row.get(2)?,
                sellingPrice: row.get(3)?,
                category: row.get(4)?,
                quantity: row.get(5)?,
            })
        })
        .unwrap();

    let mut result: Vec<Product> = Vec::new();
    for product in product_iter {
        let product_data = product.unwrap();
        println!("Found person {:?}", product_data);
        result.push(product_data);
    }
    return result;
}

pub fn get_product_by_code(code: &str, con: &Connection) -> Option<Product> {
    let result: std::result::Result<rusqlite::Statement, Error> = con.prepare(
        "SELECT code,name,buyingPrice,sellingPrice,category,quantity  FROM products where code=?",
    );
    let mut query: rusqlite::Statement = result.unwrap();

    let product_iter = query
        .query_map([code], |row| {
            Ok(Product {
                code: row.get(0)?,
                name: row.get(1)?,
                buyingPrice: row.get(2)?,
                sellingPrice: row.get(3)?,
                category: row.get(4)?,
                quantity: row.get(5)?,
            })
        })
        .unwrap();

    let mut product: Option<Product> = None;
    for result in product_iter {
        product = Some(result.unwrap());
        break; // Assuming you only expect one result, exit the loop after the first iteration
    }

    product
}
