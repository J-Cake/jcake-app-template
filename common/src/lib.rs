mod debounce;
mod config;
mod args;
mod resolve_homedir;
mod error;

use std::sync::LazyLock;
use base64::Engine;
pub use config::*;
pub use args::*;
pub use resolve_homedir::*;
pub use debounce::*;

pub use error::*;

pub use blake3;

static BASE64_ENGINE: LazyLock<base64::engine::GeneralPurpose> = LazyLock::new(|| base64::engine::GeneralPurpose::new(&base64::alphabet::STANDARD, Default::default()));

pub fn encode_base64(bin: impl AsRef<[u8]>) -> String {
    BASE64_ENGINE.encode(bin.as_ref())
}

pub fn decode_base64(str: impl AsRef<str>) -> Result<Vec<u8>> {
    Ok(BASE64_ENGINE.decode(str.as_ref())?)
}
