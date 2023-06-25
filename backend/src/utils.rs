use serde_json::json;
use serenity::model::prelude::ActivityType;
use serenity::{model::prelude::Presence, prelude::Context};

use crate::types::Song;
use crate::State;

pub async fn try_update_spotify(ctx: &Context, data: &Presence) {
    let spotify = data
        .activities
        .iter()
        .find(|activity| activity.name == "Spotify" && activity.kind == ActivityType::Listening);

    let tx = {
        let data_read = ctx.data.read().await;
        data_read.get::<State>().unwrap().clone().tx.clone()
    };

    let cache = {
        let data_read = ctx.data.read().await;
        let data = &data_read.get::<State>().unwrap().listening_cache;

        data.clone().read().ok().and_then(|state| state.clone())
    };

    if let Some(activity) = spotify {
        if let Some(song) = cache {
            if activity.sync_id == Some(song.sync_id) {
                return;
            }
        }

        let spotify = activity.clone(); // saves a bunch of time.

        let payload = Song {
            title: spotify.details.unwrap_or("unknown".to_string()),
            track_image: spotify
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
            track_url: spotify
                .sync_id
                .as_ref()
                .and_then(|v| Some("https://open.spotify.com/track/".to_string() + &v))
                .unwrap_or("unknown".to_string()),
            artists: spotify
                .state
                .and_then(|v| Some(v.split("; ").map(String::from).collect::<Vec<String>>()))
                .unwrap_or(Vec::new()),
            album: spotify
                .assets
                .and_then(|v| v.large_text)
                .unwrap_or("unknown".to_string()),
            sync_id: spotify.sync_id.unwrap_or("unknown".to_string()),
        };

        {
            let data_read = ctx.data.read().await;
            if let Ok(mut lock_write) = data_read.get::<State>().unwrap().listening_cache.write() {
                *lock_write = Some(payload.clone())
            };
        }

        if let Ok(json) = serde_json::to_string(&payload) {
            let resp = json!({
                "event": "SPOTIFY",
                "state": "UPDATE",
                "song": json
            });

            let _ = tx.send(resp.to_string());
        }
    } else {
        if let Some(_) = cache {
            // if there is something in the cache and the user has stopped listening to the music, broadcast a "STOPPED" event.
            let payload = json!({
                "event": "SPOTIFY",
                "state": "STOP",
                "song": {} // for consistencies sake.
            });

            {
                let data_read = ctx.data.read().await;
                if let Ok(mut lock_read) = data_read.get::<State>().unwrap().listening_cache.write()
                {
                    *lock_read = None
                };
            }

            let _ = tx.send(payload.to_string());
        }
    }
}

pub async fn try_update_status(ctx: &Context, data: &Presence) {
    // let cache = {
    //     let data_read = ctx.data.read().await;
    //     let data = &data_read.get::<State>().unwrap().user_status;

    //     data.clone()
    //         .read()
    //         .ok()
    //         .and_then(|state| Some(state.clone()))
    // };
    print!("hi");
}
