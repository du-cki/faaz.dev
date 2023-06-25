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

use crate::types::{BotState, Service};
use crate::utils::try_update_spotify;

struct State;
impl TypeMapKey for State {
    type Value = Arc<BotState>;
}

struct Handler {
    state: Arc<BotState>,
}

#[async_trait]
impl EventHandler for Handler {
    async fn message(&self, ctx: Context, msg: channel::Message) {
        if msg.content == "!ping" {
            if let Err(e) = msg.channel_id.say(&ctx.http, "Pong!").await {
                error!("Error sending message: {:?}", e);
            }
        }
    }

    async fn presence_update(&self, ctx: Context, data: Presence) {
        if data.user.id != self.state.user_id {
            return;
        }

        try_update_spotify(&ctx, &data).await;
        try_update_status(&ctx, &data).await;
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
    let (_tx, _) = broadcast::channel::<String>(1);

    let cache = Arc::new(SRwLock::new(None));
    let tx = Arc::new(_tx);

    let state = Arc::new(BotState {
        tx: Arc::clone(&tx),
        listening_cache: Arc::clone(&cache),
        user_status: Arc::new(SRwLock::new(OnlineStatus::Offline)),
        user_id,
    });

    let intents = GatewayIntents::GUILD_MESSAGES
        | GatewayIntents::GUILD_PRESENCES
        | GatewayIntents::MESSAGE_CONTENT;

    let client = Client::builder(&token, intents)
        .event_handler(Handler {
            state: Arc::clone(&state),
        })
        .await
        .unwrap();

    {
        let mut data = client.data.write().await;
        data.insert::<State>(Arc::clone(&state));
    }

    Ok(Service {
        bot: client,
        router: SyncWrapper::new(server::build_router(crate::types::AppState {
            tx: Arc::clone(&tx),
            cache: Arc::clone(&cache),
        })),
    })
}
