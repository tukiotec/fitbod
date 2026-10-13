import fs from 'fs';
import path from 'path';

const pluginSwiftPath = path.resolve('node_modules/@capacitor/local-notifications/ios/Sources/LocalNotificationsPlugin/LocalNotificationsPlugin.swift');

if (fs.existsSync(pluginSwiftPath)) {
  let content = fs.readFileSync(pluginSwiftPath, 'utf8');

  // 1. Fix call.getArray("notifications", JSObject.self) -> (call.options["notifications"] as? [JSObject])
  content = content.replace(
    /guard let notifications = call\.getArray\("notifications", JSObject\.self\), notifications\.count > 0 else/g,
    'guard let notifications = (call.options["notifications"] as? [JSObject]), !notifications.isEmpty else'
  );

  content = content.replace(
    /guard let notifications = call\.getArray\("notifications", JSObject\.self\) else/g,
    'guard let notifications = (call.options["notifications"] as? [JSObject]) else'
  );

  // 2. Fix call.getArray("types", JSObject.self) -> (call.options["types"] as? [JSObject])
  content = content.replace(
    /guard let types = call\.getArray\("types", JSObject\.self\) else/g,
    'guard let types = (call.options["types"] as? [JSObject]) else'
  );

  // 3. Fix bridge?.localURL(fromWebURL: webURL) -> webURL
  content = content.replace(
    /return bridge\?\.localURL\(fromWebURL: webURL\)/g,
    'return webURL'
  );

  fs.writeFileSync(pluginSwiftPath, content, 'utf8');
  console.log('[+] Successfully patched LocalNotificationsPlugin.swift for Capacitor 8 compatibility!');
} else {
  console.log('[-] LocalNotificationsPlugin.swift not found, skipping patch.');
}
