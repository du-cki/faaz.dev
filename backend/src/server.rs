use axum::{
    extract::{
        ws::{Message, WebSocket, WebSocketUpgrade},
        State,
    },
    response::IntoResponse,
    routing::get,
    Json, Router,
};
use serde_json::{json, Value};

use crate::types::AppState;

pub fn build_router(state: AppState) -> Router {
    Router::new()
        .route("/ping", get(ping))
        .route("/ws/meow", get(ws_handler))
        .with_state(state)
}

pub async fn ping() -> Json<Value> {
    json!({"message": "pong!"}).into()
}

pub async fn ws_handler(ws: WebSocketUpgrade, State(state): State<AppState>) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle_socket(socket, state))
}

pub async fn handle_socket(mut socket: WebSocket, state: AppState) -> () {
    let cached_status = {
        state
            .shared_state
            .user_status
            .read()
            .ok()
            .and_then(|status| Some(status.clone()))
    };

    if let Some(status) = cached_status {
        let payload = json!({
            "event": 2, // Status
            "state": 2, // Update
            "data": {
                "status": status
            }
        });

        let _ = socket.send(Message::Text(payload.to_string())).await;
    }

    let cached_song = {
        state
            .shared_state
            .listening_cache
            .clone()
            .read()
            .ok()
            .and_then(|song| song.clone())
    };

    if let Some(song) = cached_song {
        // just incase if i'm already listening to a song when someone connects to the WS.
        let payload = json!({
            "event": 1, // Spotify
            "state": 2, // Update
            "data": {
                "song": song
            }
        });

        let _ = socket.send(Message::Text(payload.to_string())).await;
    }

    let mut rx = state.shared_state.tx.subscribe();
    while let Ok(msg) = rx.recv().await {
        let _ = socket.send(Message::Text(msg)).await;
    }
}
