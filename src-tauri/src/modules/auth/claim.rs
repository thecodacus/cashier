use super::super::models::role::Role;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub username: String,
    pub first_name: String,
    pub last_name: String,
    pub role: Role,
}
