use rusqlite::types::FromSqlError;
use rusqlite::types::{FromSql, FromSqlResult, ToSql, ToSqlOutput, ValueRef};
use serde::{Deserialize, Serialize};
#[derive(Debug, Serialize, Deserialize)]
pub enum Role {
    #[serde(rename = "admin")]
    ADMIN,
    #[serde(rename = "staff")]
    STAFF,
    #[serde(rename = "manager")]
    MANAGER,
    #[serde(rename = "guest")]
    GUEST,
}
impl FromSql for Role {
    fn column_result(value: ValueRef<'_>) -> FromSqlResult<Self> {
        match value {
            ValueRef::Text(text) => {
                let role_text = std::str::from_utf8(text).unwrap();
                match role_text {
                    "admin" => Ok(Role::ADMIN),
                    "staff" => Ok(Role::STAFF),
                    "manager" => Ok(Role::MANAGER),
                    "guest" => Ok(Role::GUEST),
                    _ => Err(FromSqlError::InvalidType),
                }
            }
            _ => Err(FromSqlError::InvalidType),
        }
    }
}

impl ToSql for Role {
    fn to_sql(&self) -> rusqlite::Result<ToSqlOutput<'_>> {
        let role_text = match self {
            Role::ADMIN => "admin",
            Role::STAFF => "staff",
            Role::MANAGER => "manager",
            Role::GUEST => "guest",
        };
        Ok(ToSqlOutput::from(role_text))
    }
}
