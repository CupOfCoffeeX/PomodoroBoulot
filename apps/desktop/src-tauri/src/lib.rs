use tauri::Manager;

#[tauri::command]
fn set_always_on_top(window: tauri::WebviewWindow, always_on_top: bool) -> Result<(), String> {
    window.set_always_on_top(always_on_top).map_err(|e| e.to_string())
}

#[tauri::command]
fn set_window_size(window: tauri::WebviewWindow, width: f64, height: f64) -> Result<(), String> {
    window
        .set_size(tauri::LogicalSize::new(width, height))
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn set_decorations(window: tauri::WebviewWindow, decorations: bool) -> Result<(), String> {
    window.set_decorations(decorations).map_err(|e| e.to_string())
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .setup(|app| {
            #[cfg(debug_assertions)]
            app.get_webview_window("main").unwrap().open_devtools();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            set_always_on_top,
            set_window_size,
            set_decorations,
        ])
        .run(tauri::generate_context!())
        .expect("error while running PomodoroBoulot");
}
