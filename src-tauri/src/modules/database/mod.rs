use rusqlite::Connection;

pub fn connect_db(path: &str) -> Connection {
    let result = Connection::open(path);
    let db = result.unwrap();
    return db;
}
