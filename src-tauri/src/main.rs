// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod modules;

use home;
use modules::auth::{get_str_hash, login};
use modules::models::product;
use modules::models::product::Product;
use modules::{database::connect_db, models::user, models::user::User};
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
            authenticate_user
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
    let con: Connection = connect_db(&get_database_path());
    print!("calling setup db \n");
    let sql: &str = "
        CREATE TABLE IF NOT EXISTS products (
            code TEXT PRIMARY KEY,
            name  TEXT NOT NULL,
            price REAL NOT NULL,
            category TEXT NULL,
            quantity INTEGER NOT NULL
        );
    ";
    let params: () = ();
    let _result = con.execute(sql, params)?;
    print!("setup db: [create products table] {_result}\n");
    let _result = con.execute(
        "
        CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                first_name  TEXT NOT NULL,
                last_name TEXT NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL
            );
    ",
        (),
    )?;
    print!("setup db: [create users table] {_result}\n");
    let pass_hash = get_str_hash("admin");
    let _result = con.execute(
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
    )?;
    print!("setup db: [create admin user] {_result}\n");

    Ok(())
}

#[tauri::command]
fn get_all_products() -> Vec<Product> {
    let con: Connection = connect_db(&get_database_path());
    return product::get_all_products(con);
}

#[tauri::command]
fn get_product_by_code(code: &str) -> Option<Product> {
    let con: Connection = connect_db(&get_database_path());
    return product::get_product_by_code(code, con);
}

#[tauri::command]
fn save_product(product: Product) -> Product {
    let con: Connection = connect_db(&get_database_path());
    // Save the product to the database
    product.save(con);

    product // Indicate success
}

#[tauri::command]
fn delete_product(code: &str) -> bool {
    let con: Connection = connect_db(&get_database_path());
    let product = get_product_by_code(code);
    // Save the product to the database
    if let Some(product) = product {
        product.delete(con);
    }

    true // Indicate success
}

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
