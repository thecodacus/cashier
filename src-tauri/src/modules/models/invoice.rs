use core::num;

use rusqlite::{params, Connection, Error};

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct LineItem {
    pub id: Option<i32>,
    pub invoiceNumber: i32,
    pub productCode: String,
    pub name: String,
    pub quantity: i64,
    pub itemPrice: f32,
    pub discount: f32,
    pub subtotal: f32,
    pub profit: f32,
    pub cgst: f32,
    pub sgst: f32,
    pub igst: f32,
    pub total: f32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Invoice {
    pub number: Option<i32>,
    pub buyer_id: i64,
    pub date: i64,
    pub discount: f32,
    pub subtotal: f32,
    pub profit: f32,
    pub cgst: f32,
    pub sgst: f32,
    pub igst: f32,
    pub total: f32,
    pub paid_by: String,
}

impl Invoice {
    pub fn save(&self, conn: &Connection) -> i32 {
        if let Some(number) = self.number {
            conn.execute(
                "INSERT OR REPLACE INTO invoices (
                 number
                buyer_id, 
                date, 
                subtotal, 
                discount, 
                profit, 
                cgst, 
                sgst, 
                igst, 
                total,
                paid_by
            ) VALUES (?, ?, ?,?, ?, ?,?,?,?,?,?)",
                params![
                    self.number,
                    self.buyer_id,
                    self.date,
                    self.subtotal,
                    self.discount,
                    self.profit,
                    self.cgst,
                    self.sgst,
                    self.igst,
                    self.total,
                    &self.paid_by
                ],
            )
            .unwrap();
            return number;
        } else {
            conn.execute(
                "INSERT INTO invoices (
                 
                buyer_id, 
                date, 
                subtotal, 
                discount, 
                profit, 
                cgst, 
                sgst, 
                igst, 
                total,
                paid_by
            ) VALUES (?, ?, ?,?, ?, ?,?,?,?,?)",
                params![
                    self.buyer_id,
                    self.date,
                    self.subtotal,
                    self.discount,
                    self.profit,
                    self.cgst,
                    self.sgst,
                    self.igst,
                    self.total,
                    &self.paid_by
                ],
            )
            .unwrap();
            return conn.last_insert_rowid() as i32;
        }
    }
    pub fn delete(&self, conn: &Connection) {
        conn.execute(
            "DELETE FROM invoices WHERE number = ?",
            params![&self.number],
        )
        .unwrap();
    }
    pub fn setup_db(conn: &Connection) {
        print!("calling setup db \n");
        let sql: &str = "
            CREATE TABLE IF NOT EXISTS invoices (
                number INTEGER PRIMARY KEY AUTOINCREMENT,
                buyer_id  INTEGER NOT NULL,
                date INTEGER NOT NULL,
                subtotal REAL NOT NULL,
                discount REAL NOT NULL,
                profit REAL NOT NULL,
                cgst REAL NOT NULL, 
                sgst REAL NOT NULL,
                igst REAL NOT NULL,
                total REAL NOT NULL,
                paid_by TEXT NOT NULL
            );
        ";
        let params: () = ();
        let _result = conn.execute(sql, params).unwrap();
        print!("setup db: [create invoices table] {_result}\n");
    }
}

pub fn get_all_invoices(con: &Connection) -> Vec<Invoice> {
    let result: std::result::Result<rusqlite::Statement, Error> = con.prepare(
        "SELECT number, buyer_id, date, subtotal, discount,profit, cgst, sgst, igst, total,paid_by  FROM invoices",
    );
    let mut query: rusqlite::Statement = result.unwrap();

    let item_iter = query
        .query_map([], |row| {
            Ok(Invoice {
                number: row.get(0)?,
                buyer_id: row.get(1)?,
                date: row.get(2)?,
                subtotal: row.get(3)?,
                discount: row.get(4)?,
                profit: row.get(5)?,
                cgst: row.get(6)?,
                sgst: row.get(7)?,
                igst: row.get(8)?,
                total: row.get(9)?,
                paid_by: row.get(10)?,
            })
        })
        .unwrap();

    let mut result: Vec<Invoice> = Vec::new();
    for item in item_iter {
        let item_data = item.unwrap();
        println!("Found person {:?}", item_data);
        result.push(item_data);
    }
    return result;
}

pub fn get_invoice_by_number(number: i32, con: &Connection) -> Option<Invoice> {
    let result: std::result::Result<rusqlite::Statement, Error> = con.prepare(
        "SELECT number, buyer_id, date, subtotal, discount,profit, cgst, sgst, igst, total,paid_by  FROM invoice where number=?",
    );
    let mut query: rusqlite::Statement = result.unwrap();

    let item_iter = query
        .query_map([number], |row| {
            Ok(Invoice {
                number: row.get(0)?,
                buyer_id: row.get(1)?,
                date: row.get(2)?,
                subtotal: row.get(3)?,
                discount: row.get(4)?,
                profit: row.get(5)?,
                cgst: row.get(6)?,
                sgst: row.get(7)?,
                igst: row.get(8)?,
                total: row.get(9)?,
                paid_by: row.get(10)?,
            })
        })
        .unwrap();

    let mut item: Option<Invoice> = None;
    for result in item_iter {
        item = Some(result.unwrap());
        break; // Assuming you only expect one result, exit the loop after the first iteration
    }

    item
}

impl LineItem {
    pub fn save(&self, conn: &Connection) -> i32 {
        if let Some(id) = self.id {
            conn.execute(
                "INSERT OR REPLACE INTO invoice_lineitems (
                id, 
                invoiceNumber, 
                productCode,
                name, 
                quantity, 
                itemPrice, 
                discount, 
                subtotal,
                profit,
                cgst, 
                sgst, 
                igst, 
                total
            ) 
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
                params![
                    id,
                    self.invoiceNumber,
                    &self.productCode,
                    &self.name,
                    self.quantity,
                    self.itemPrice,
                    self.discount,
                    self.subtotal,
                    self.profit,
                    self.cgst,
                    self.sgst,
                    self.igst,
                    self.total
                ],
            )
            .unwrap();
            return id;
        } else {
            conn.execute(
                "INSERT OR REPLACE INTO invoice_lineitems ( 
                invoiceNumber, 
                productCode,
                name, 
                quantity, 
                itemPrice, 
                discount, 
                subtotal,
                profit,
                cgst, 
                sgst, 
                igst, 
                total
            ) 
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
                params![
                    self.invoiceNumber,
                    &self.productCode,
                    &self.name,
                    self.quantity,
                    self.itemPrice,
                    self.discount,
                    self.subtotal,
                    self.profit,
                    self.cgst,
                    self.sgst,
                    self.igst,
                    self.total
                ],
            )
            .unwrap();
            return conn.last_insert_rowid() as i32;
        }
    }
    pub fn delete(&self, conn: &Connection) {
        conn.execute(
            "DELETE FROM invoice_lineitems WHERE id = ?",
            params![&self.id],
        )
        .unwrap();
    }
    pub fn setup_db(conn: &Connection) {
        print!("calling setup db \n");
        let sql: &str = "
            CREATE TABLE IF NOT EXISTS invoice_lineitems (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                invoiceNumber INTEGER NOT NULL,
                productCode TEXT NOT NULL,
                name TEXT NOT NULL,
                quantity  INTEGER NOT NULL,
                itemPrice REAL NOT NULL,
                discount REAL NOT NULL,
                subtotal REAL NOT NULL,
                profit REAL NOT NULL,
                cgst REAL NOT NULL, 
                sgst REAL NOT NULL,
                igst REAL NOT NULL,
                total REAL NOT NULL
            );
        ";
        let params: () = ();
        let _result = conn.execute(sql, params).unwrap();
        print!("setup db: [create invoice_lineitems table] {_result}\n");
    }
}

pub fn get_all_invoice_lineitems(invoice_number: i32, con: &Connection) -> Vec<LineItem> {
    let result: std::result::Result<rusqlite::Statement, Error> = con.prepare(
        "SELECT id, 
                invoiceNumber, 
                productCode,
                name, 
                quantity, 
                itemPrice, 
                discount, 
                subtotal,
                profit,
                cgst, 
                sgst, 
                igst, 
                total

                FROM invoice_lineitems WHERE invoiceNumber = ?",
    );
    let mut query: rusqlite::Statement = result.unwrap();

    let item_iter = query
        .query_map([invoice_number], |row| {
            Ok(LineItem {
                id: row.get(0)?,
                invoiceNumber: row.get(1)?,
                productCode: row.get(2)?,
                name: row.get(3)?,
                quantity: row.get(4)?,
                itemPrice: row.get(5)?,
                discount: row.get(6)?,
                subtotal: row.get(7)?,
                profit: row.get(8)?,
                cgst: row.get(9)?,
                sgst: row.get(10)?,
                igst: row.get(11)?,
                total: row.get(12)?,
            })
        })
        .unwrap();

    let mut result: Vec<LineItem> = Vec::new();
    for item in item_iter {
        let item_data = item.unwrap();
        println!("Found person {:?}", item_data);
        result.push(item_data);
    }
    return result;
}

pub fn get_line_item_by_id(id: i32, conn: &Connection) -> Option<LineItem> {
    let result: std::result::Result<rusqlite::Statement, Error> = conn.prepare(
        "SELECT id, 
                invoiceNumber, 
                productCode,
                name, 
                quantity, 
                itemPrice, 
                discount, 
                subtotal,
                profit,
                cgst, 
                sgst, 
                igst, 
                total

                FROM invoice_lineitems WHERE id = ?",
    );
    let mut query: rusqlite::Statement = result.unwrap();

    let item_iter = query
        .query_map([id], |row| {
            Ok(LineItem {
                id: row.get(0)?,
                invoiceNumber: row.get(1)?,
                productCode: row.get(2)?,
                name: row.get(3)?,
                quantity: row.get(4)?,
                itemPrice: row.get(5)?,
                discount: row.get(6)?,
                subtotal: row.get(7)?,
                profit: row.get(8)?,
                cgst: row.get(9)?,
                sgst: row.get(10)?,
                igst: row.get(11)?,
                total: row.get(12)?,
            })
        })
        .unwrap();

    let mut item: Option<LineItem> = None;
    for result in item_iter {
        item = Some(result.unwrap());
        break; // Assuming you only expect one result, exit the loop after the first iteration
    }
    return item;
}
