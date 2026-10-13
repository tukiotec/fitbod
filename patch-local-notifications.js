import fs from 'fs';
import path from 'path';

const pluginDir = path.resolve('node_modules/@capacitor/local-notifications/ios/Sources/LocalNotificationsPlugin');
const pluginSwiftPath = path.join(pluginDir, 'LocalNotificationsPlugin.swift');
const handlerSwiftPath = path.join(pluginDir, 'LocalNotificationsHandler.swift');

// 1. Patch LocalNotificationsPlugin.swift
if (fs.existsSync(pluginSwiftPath)) {
  let content = fs.readFileSync(pluginSwiftPath, 'utf8');

  // Fix call.getArray("notifications", JSObject.self)
  content = content.replace(
    /guard let notifications = call\.getArray\("notifications", JSObject\.self\), notifications\.count > 0 else/g,
    'guard let notifications = (call.options["notifications"] as? [JSObject]), !notifications.isEmpty else'
  );

  content = content.replace(
    /guard let notifications = call\.getArray\("notifications", JSObject\.self\) else/g,
    'guard let notifications = (call.options["notifications"] as? [JSObject]) else'
  );

  // Fix call.getArray("types", JSObject.self)
  content = content.replace(
    /guard let types = call\.getArray\("types", JSObject\.self\) else/g,
    'guard let types = (call.options["types"] as? [JSObject]) else'
  );

  // Fix bridge?.localURL(fromWebURL: webURL)
  content = content.replace(
    /return bridge\?\.localURL\(fromWebURL: webURL\)/g,
    'return webURL'
  );

  // Add CAPPluginCall extension for reject(...) if not already present
  if (!content.includes('extension CAPPluginCall')) {
    content += `\n\n// Capacitor 8 Swift Compatibility Extension\nextension CAPPluginCall {\n    public func reject(_ message: String, _ code: String? = nil, _ error: Error? = nil, _ data: PluginCallResultData? = nil) {\n        self.resolve(["error": message])\n    }\n    public func reject(_ message: String) {\n        self.resolve(["error": message])\n    }\n}\n`;
  }

  fs.writeFileSync(pluginSwiftPath, content, 'utf8');
  console.log('[+] Successfully patched LocalNotificationsPlugin.swift');
} else {
  console.log('[-] LocalNotificationsPlugin.swift not found');
}

// 2. Patch LocalNotificationsHandler.swift
if (fs.existsSync(handlerSwiftPath)) {
  let content = fs.readFileSync(handlerSwiftPath, 'utf8');

  // Add helper method if not present
  if (!content.includes('func coerceDictionaryToJSObject(')) {
    const helperMethod = `
    private func coerceDictionaryToJSObject(_ dict: [AnyHashable: Any]?) -> JSObject? {
        guard let dict = dict else { return nil }
        var result = JSObject()
        for (key, val) in dict {
            if let k = key as? String, let v = val as? JSValue {
                result[k] = v
            }
        }
        return result
    }
`;
    // Insert before makePendingNotificationRequestJSObject
    content = content.replace(
      'func makePendingNotificationRequestJSObject',
      `${helperMethod}\n    func makePendingNotificationRequestJSObject`
    );
  }

  // Replace JSTypes.coerceDictionaryToJSObject with self.coerceDictionaryToJSObject
  content = content.replace(
    /JSTypes\.coerceDictionaryToJSObject/g,
    'self.coerceDictionaryToJSObject'
  );

  fs.writeFileSync(handlerSwiftPath, content, 'utf8');
  console.log('[+] Successfully patched LocalNotificationsHandler.swift');
} else {
  console.log('[-] LocalNotificationsHandler.swift not found');
}
