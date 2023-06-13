pub mod claim;

use std::{
    collections::hash_map::DefaultHasher,
    hash::{Hash, Hasher},
};

use super::models::user;
use claim::Claims;
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use rusqlite::Connection;

static JWTKEY: &str = "jwtsecretkey";

pub fn get_str_hash(input: &str) -> String {
    let mut hasher = DefaultHasher::new();
    input.hash(&mut hasher);
    let hash = hasher.finish();
    return format!("{:x}", hash);
}

pub fn login(username: &str, password: &str, con: &Connection) -> Result<String, String> {
    // Perform authentication logic here
    // Check if the username and password are valid
    let password_hash = get_str_hash(password);
    let is_authenticated = user::authenticate_user(username, &password_hash, &con);
    if !is_authenticated {
        return Err("Authentication failed".to_string());
    }

    let user = user::get_user_by_id(username, &con).unwrap();
    // If authentication succeeds, generate a JWT token
    let claims = Claims {
        username: username.to_owned(),
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
    };

    let encoding_key = EncodingKey::from_secret(JWTKEY.as_bytes());
    let token =
        encode(&Header::default(), &claims, &encoding_key).map_err(|err| err.to_string())?;

    Ok(token)
}

fn authenticate(token: &str) -> Result<Claims, String> {
    let decoding_key = DecodingKey::from_secret(JWTKEY.as_bytes());

    let validation = Validation::default();
    let token_data = decode::<Claims>(token, &decoding_key, &validation)
        .map(|data| data.claims)
        .map_err(|err| err.to_string())?;

    Ok(token_data)
}
