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
    let cache = {
        let data = &state.cache;
        if let Ok(song) = data.clone().read() {
            song.clone()
        } else {
            None
        }
    };

    if let Some(song) = cache {
        // just incase if i'm already listening to a song when someone connects to the WS.
        if let Ok(json) = serde_json::to_string(&song) {
            let payload = json!({
                "event": "SPOTIFY",
                "state": "UPDATE",
                "song": json
            });

            let _ = socket.send(Message::Text(payload.to_string())).await;
        }
    };

    let mut rx = state.tx.subscribe();
    while let Ok(msg) = rx.recv().await {
        let _ = socket.send(Message::Text(msg)).await;
    }
}
