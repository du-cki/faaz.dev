use std::sync::Arc;

use serde_json::json;
use serenity::model::prelude::ActivityType;
use serenity::model::prelude::Presence;

use crate::types::{BotState, Song};

pub async fn try_update_spotify(data: &Presence, state: &Arc<BotState>) {
    let spotify = data
        .activities
        .iter()
        .find(|activity| activity.name == "Spotify" && activity.kind == ActivityType::Listening);

    let cached_sp = {
        state
            .listening_cache
            .read()
            .ok()
            .and_then(|state| state.clone())
    };

    if let Some(activity) = spotify {
        if let Some(cached_song) = cached_sp {
            if Some(cached_song.sync_id) != activity.sync_id {
                return;
            }
        }

        let activity = activity.clone();

        // as much as i hate to do this, i have no choice, if you have a better
        // solution please let me know
        let payload = Song {
            title: activity.details.unwrap_or("unknown".to_string()),
            track_url: activity
                .sync_id
                .as_ref()
                .and_then(|sync_id| Some("https://open.spotify.com/track/".to_owned() + sync_id))
                .unwrap_or("unknown".to_string()),
            artists: activity
                .state
                .and_then(|v| Some(v.split("; ").map(String::from).collect::<Vec<String>>()))
                .unwrap_or(Vec::new()),
            sync_id: activity.sync_id.unwrap_or("unknown".to_string()),
            track_image: activity
                .assets
                .as_ref()
                .and_then(|v| {
                    if let Some(album_url) = &v.large_image {
                        Some(album_url.replace("spotify:", "https://i.scdn.co/image/"))
                    } else {
                        Some("unknown".to_string())
                    }
                })
                .unwrap_or("unknown".to_string()),
            album: activity
                .assets
                .and_then(|v| v.large_text)
                .unwrap_or("unknown".to_string()),
        };

        {
            if let Ok(mut lock_write) = state.listening_cache.write() {
                *lock_write = Some(payload.clone())
            }
        }

        if let Ok(json) = serde_json::to_string(&payload) {
            let resp = json!({
                "event": "SPOTIFY",
                "state": "UPDATE",
                "data": {
                    "song": json
                }
            });

            let tx = state.tx.clone();
            let _ = tx.send(resp.to_string());
        }
    } else {
        if let Some(_) = cached_sp {
            // if there is something in the cache and the user has stopped
            // listening to the music, broadcast a "STOP" event and update the cache.
            let payload = json!({
                "event": "SPOTIFY",
                "state": "STOP",
                "data": {}
            });

            {
                if let Ok(mut lock_write) = state.listening_cache.write() {
                    *lock_write = None
                }
            }

            let tx = state.tx.clone();
            let _ = tx.send(payload.to_string());
        }
    }
}

pub async fn try_update_status(data: &Presence, state: &Arc<BotState>) {
    let new_status = data.status;

    let user_cached_status = {
        state
            .user_status
            .read()
            .ok()
            .and_then(|state| Some(state.clone()))
    };

    if let Some(user_status) = user_cached_status {
        if new_status == user_status {
            return;
        } else {
            let payload = json!({
                "event": "STATUS",
                "state": "UPDATE",
                "data": {
                    "status": new_status
                }
            });

            {
                if let Ok(mut lock_write) = state.user_status.write() {
                    *lock_write = new_status
                }
            }

            let tx = state.tx.clone();
            let _ = tx.send(payload.to_string());
        }
    }
}
