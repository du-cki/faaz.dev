use std::{
    net::SocketAddr,
    sync::{Arc, RwLock},
};

use axum::Router;
use serde::Serialize;
use serenity::{model::user::OnlineStatus, Client};
use sync_wrapper::SyncWrapper;
use tokio::sync::broadcast::Sender;

#[derive(Clone, Debug, Serialize)]
pub struct Song {
    pub title: String,
    pub track_url: String,
    pub track_image: String,
    pub artists: Vec<String>,
    pub album: String,
    pub sync_id: String, // purely for UID reasons.
}

#[derive(Clone, Debug)]
pub struct SharedState {
    /// The broadcast Sender.
    pub tx: Arc<Sender<String>>,
    /// A cache that contains only one song.
    pub listening_cache: Arc<RwLock<Option<Song>>>,
    /// The user status (online, offline, etc.) and the unix timestamp from
    /// the last time offline, defaults to 0 when online.
    pub user_status: Arc<RwLock<(OnlineStatus, u64)>>,
}

#[derive(Clone, Debug)]
pub struct AppState {
    pub shared_state: Arc<SharedState>,
}

pub struct Service {
    pub bot: Client,
    pub router: SyncWrapper<Router>,
}

#[async_trait::async_trait]
impl shuttle_service::Service for Service {
    async fn bind(mut self, addr: SocketAddr) -> Result<(), shuttle_service::error::Error> {
        let router = self.router.into_inner();
        let app = axum::Server::bind(&addr).serve(router.into_make_service());

        tokio::select!(
            _ = self.bot.start() => {},
            _ = app => {}
        );

        Ok(())
    }
}
