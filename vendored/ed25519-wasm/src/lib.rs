use wasm_bindgen::prelude::*;
use ed25519_compact::{PublicKey, Signature};
use std::convert::TryInto;

#[wasm_bindgen]
pub fn check(key: &str, signature: &str, message: &str) -> bool  {
    match hex::decode(key) {
        Ok(key) => match key.try_into() {
            Ok(key) => match hex::decode(signature) {
                Ok(signature) => match signature.try_into() {
                    Ok(signature) => {
                        let pk = PublicKey::new(key);
                        let sig = Signature::new(signature);
    
                        pk.verify(message, &sig).is_ok()
                    },
                    _ => false
                },
                _ => false
            },
            _ => false
        },
        _ => false
    }
}

#[wasm_bindgen]
pub fn greet() -> String {
    "say hi to the world!".into()
}
