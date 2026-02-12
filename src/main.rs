use std::path::PathBuf;

#[derive(clap::Parser)]
pub struct Args {
    #[clap(long, short, default_value = "./config.toml")]
    config: PathBuf,
}

#[tokio::main]
pub async fn main() {
    env_logger::init();

    log::info!("starting up");

    let worker = tokio::spawn(async move {

    });

    let (..) = tokio::join!(worker);
}