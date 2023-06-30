use serenity::async_trait;
use serenity::model::channel;
use serenity::model::gateway::{Presence, Ready};
use serenity::model::user::OnlineStatus;
use serenity::prelude::*;
use utils::try_update_status;

use std::sync::{Arc, RwLock as SRwLock}; // due to serenity prelude exporting its own RwLock.
use sync_wrapper::SyncWrapper;
use tokio::sync::broadcast;

use shuttle_secrets::SecretStore;

use tracing::*;

mod server;
mod types;
mod utils;

use crate::server::build_router;
use crate::types::{AppState, Service, SharedState};
use crate::utils::{get_unix_time, try_update_spotify};

struct Handler {
    state: Arc<SharedState>,
    user_id: u64,
}

#[async_trait]
impl EventHandler for Handler {
    async fn message(&self, ctx: Context, msg: channel::Message) {
        if msg.content == "!ping" {
            let _ = msg.channel_id.say(&ctx.http, "Pong!").await;
        }
    }

    async fn presence_update(&self, _ctx: Context, data: Presence) {
        if data.user.id != self.user_id {
            return;
        }

        try_update_spotify(&data, &self.state).await;
        try_update_status(&data, &self.state).await;
    }

    async fn ready(&self, _: Context, ready: Ready) {
        info!("{} is connected!", ready.user.name);
    }
}

#[shuttle_runtime::main]
async fn init(
    #[shuttle_secrets::Secrets] secret_store: SecretStore,
) -> Result<Service, shuttle_service::Error> {
    let token = secret_store.get("DISCORD_TOKEN").unwrap();
    let user_id = secret_store.get("USER_ID").unwrap().parse::<u64>().unwrap();
    let (tx, _) = broadcast::channel::<String>(16);

    let state = Arc::new(SharedState {
        tx: Arc::new(tx),
        listening_cache: Arc::new(SRwLock::new(None)),
        user_status: Arc::new(SRwLock::new((OnlineStatus::Offline, get_unix_time()))),
    });

    let client = Client::builder(&token, GatewayIntents::GUILD_PRESENCES)
        .event_handler(Handler {
            state: Arc::clone(&state),
            user_id,
        })
        .await
        .unwrap();

    Ok(Service {
        bot: client,
        router: SyncWrapper::new(build_router(AppState {
            shared_state: Arc::clone(&state),
        })),
    })
}
