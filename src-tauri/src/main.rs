// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod modules;

use home;
use modules::auth::login;
use modules::models::invoice::{self, Invoice, LineItem};
use modules::models::product::Product;
use modules::models::{customer, product};
use modules::{
    database::connect_db,
    models::user,
    models::{customer::Customer, user::User},
};
use rusqlite::{Connection, Result};
use std::fs;
use std::path::{Path, PathBuf};

fn main() {
    let _ = setup_db();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_all_products,
            get_product_by_code,
            save_product,
            delete_product,
            get_all_users,
            get_user_by_id,
            authenticate_user,
            get_all_invoices,
            get_invoice_by_number,
            save_invoice,
            delete_invoice,
            get_all_invoice_lineitems,
            save_invoice_lineitems,
            delete_lineitem,
            get_all_customers,
            get_customer_by_id,
            save_customer,
            delete_customer
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn get_database_path() -> String {
    let mut final_path = PathBuf::from("./database.db3");

    if let Some(home_dir) = home::home_dir() {
        final_path = Path::new(&home_dir).join(".cashier").join("database.db3");

        if let Some(parent_dir) = final_path.parent() {
            if !parent_dir.exists() {
                fs::create_dir_all(parent_dir).unwrap();
            }
        }
    }

    final_path.display().to_string()
}

fn setup_db() -> Result<()> {
    let conn: Connection = connect_db(&get_database_path());
    Customer::setup_db(&conn);
    Invoice::setup_db(&conn);
    LineItem::setup_db(&conn);
    Product::setup_db(&conn);
    User::setup_db(&conn);
    Ok(())
}

//product commands
#[tauri::command]
fn get_all_products() -> Vec<Product> {
    let con: Connection = connect_db(&get_database_path());
    return product::get_all_products(&con);
}

#[tauri::command]
fn get_product_by_code(code: &str) -> Option<Product> {
    let con: Connection = connect_db(&get_database_path());
    return product::get_product_by_code(code, &con);
}

#[tauri::command]
fn save_product(product: Product) -> Product {
    let con: Connection = connect_db(&get_database_path());
    // Save the product to the database
    product.save(&con);

    product // Indicate success
}

#[tauri::command]
fn delete_product(code: &str) -> bool {
    let con: Connection = connect_db(&get_database_path());
    let product = get_product_by_code(code);
    // Save the product to the database
    if let Some(product) = product {
        product.delete(&con);
    }

    true // Indicate success
}

// user commands
#[tauri::command]
fn get_all_users() -> Vec<User> {
    let con: Connection = connect_db(&get_database_path());
    let users = user::get_all_users(&con);
    return users;
}

#[tauri::command]
fn get_user_by_id(id: &str) -> Option<User> {
    let con: Connection = connect_db(&get_database_path());
    let user = user::get_user_by_id(id, &con);
    return user;
}

#[tauri::command]
fn authenticate_user(username: &str, password: &str) -> Result<String, String> {
    let con: Connection = connect_db(&get_database_path());
    return login(username, password, &con);
}

//invoices command
#[tauri::command]
fn get_all_invoices() -> Vec<Invoice> {
    let con: Connection = connect_db(&get_database_path());
    return invoice::get_all_invoices(&con);
}

#[tauri::command]
fn get_invoice_by_number(number: i32) -> Option<Invoice> {
    let con: Connection = connect_db(&get_database_path());
    return invoice::get_invoice_by_number(number, &con);
}

#[tauri::command]
fn save_invoice(mut invoice: Invoice) -> Invoice {
    let con: Connection = connect_db(&get_database_path());
    // Save the invoice to the database
    let number = invoice.save(&con);
    invoice.number = Some(number); // Indicate success
    return invoice;
}

#[tauri::command]
fn delete_invoice(number: i32) -> bool {
    let con: Connection = connect_db(&get_database_path());
    let invoice = invoice::get_invoice_by_number(number, &con);
    // Save the invoice to the database
    if let Some(invoice) = invoice {
        invoice.delete(&con);
    }

    true // Indicate success
}

// lineitems

#[tauri::command]
fn get_all_invoice_lineitems(number: i32) -> Vec<LineItem> {
    let con: Connection = connect_db(&get_database_path());
    return invoice::get_all_invoice_lineitems(number, &con);
}

#[tauri::command]
fn save_invoice_lineitems(mut items: Vec<LineItem>) -> Result<Vec<LineItem>, std::string::String> {
    let con: Connection = connect_db(&get_database_path());
    // Save the invoice to the database
    for item in &mut items {
        let id = item.save(&con);
        item.id = Some(id);
        let found_product_req = product::get_product_by_code(&item.productCode, &con);
        if found_product_req.is_none() {
            return Err("Product Code Not Found:".to_string() + &item.productCode);
        }
        let mut product = found_product_req.unwrap();
        product.quantity = product.quantity - item.quantity as i32;
        product.save(&con);
    }
    return Ok(items);
}

#[tauri::command]
fn delete_lineitem(id: i32) -> bool {
    let con: Connection = connect_db(&get_database_path());
    let item: Option<LineItem> = invoice::get_line_item_by_id(id, &con);
    // Save the invoice to the database
    if let Some(item) = item {
        item.delete(&con);
    }

    true // Indicate success
}

//customer commands
#[tauri::command]
fn get_all_customers() -> Vec<Customer> {
    let con: Connection = connect_db(&get_database_path());
    return customer::get_all_customers(&con);
}

#[tauri::command]
fn get_customer_by_id(id: i64) -> Option<Customer> {
    let con: Connection = connect_db(&get_database_path());
    return customer::get_customers_by_phone(id, &con);
}

#[tauri::command]
fn save_customer(customer: Customer) -> Customer {
    let con: Connection = connect_db(&get_database_path());
    // Save the invoice to the database
    customer.save(&con);

    customer // Indicate success
}

#[tauri::command]
fn delete_customer(id: i64) -> bool {
    let con: Connection = connect_db(&get_database_path());
    let cust = customer::get_customers_by_phone(id, &con);
    // Save the invoice to the database
    if let Some(cust) = cust {
        cust.delete(&con);
    }

    true // Indicate success
}
