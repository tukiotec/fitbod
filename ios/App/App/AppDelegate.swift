import UIKit
import Capacitor
import AVFoundation

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Configure AVAudioSession for background audio playback
        do {
            try AVAudioSession.sharedInstance().setCategory(.playback, mode: .default, options: [.mixWithOthers, .duckOthers])
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {
            print("Failed to configure AVAudioSession: \(error)")
        }
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }

    func application(_ application: UIApplication,
                     configurationForConnecting connectingSceneSession: UISceneSession,
                     options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        let config = UISceneConfiguration(name: "Default Configuration",
                                          sessionRole: connectingSceneSession.role)
        config.delegateClass = SceneDelegate.self
        return config
    }
}

// MARK: - Native Document Storage Plugin for Permanent Data Persistence
@objc(NativeStoragePlugin)
public class NativeStoragePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "NativeStoragePlugin"
    public let jsName = "NativeStorage"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "writeDocumentFile", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "readDocumentFile", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "listDocumentFiles", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "writePreference", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "readPreference", returnType: CAPPluginReturnPromise)
    ]

    @objc func writeDocumentFile(_ call: CAPPluginCall) {
        let name = (call.options["name"] as? String) ?? "fitbod_backup_latest.json"
        let content = (call.options["content"] as? String) ?? ""
        if let docsDir = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first {
            let fileURL = docsDir.appendingPathComponent(name)
            do {
                try content.write(to: fileURL, atomically: true, encoding: .utf8)
                call.resolve(["success": true, "path": fileURL.path])
                return
            } catch {
                call.resolve(["success": false, "error": error.localizedDescription])
                return
            }
        }
        call.resolve(["success": false, "error": "No documents directory"])
    }

    @objc func readDocumentFile(_ call: CAPPluginCall) {
        let name = (call.options["name"] as? String) ?? "fitbod_backup_latest.json"
        if let docsDir = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first {
            let fileURL = docsDir.appendingPathComponent(name)
            if FileManager.default.fileExists(atPath: fileURL.path) {
                do {
                    let content = try String(contentsOf: fileURL, encoding: .utf8)
                    call.resolve(["success": true, "content": content])
                    return
                } catch {
                    call.resolve(["success": false, "error": error.localizedDescription])
                    return
                }
            } else {
                call.resolve(["success": false, "error": "File does not exist"])
                return
            }
        }
        call.resolve(["success": false, "error": "No documents directory"])
    }

    @objc func listDocumentFiles(_ call: CAPPluginCall) {
        if let docsDir = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first {
            do {
                let fileURLs = try FileManager.default.contentsOfDirectory(at: docsDir, includingPropertiesForKeys: nil)
                let names = fileURLs.map { $0.lastPathComponent }
                call.resolve(["success": true, "files": names])
                return
            } catch {
                call.resolve(["success": false, "files": []])
                return
            }
        }
        call.resolve(["success": false, "files": []])
    }

    @objc func writePreference(_ call: CAPPluginCall) {
        let key = (call.options["key"] as? String) ?? ""
        let value = (call.options["value"] as? String) ?? ""
        if !key.isEmpty {
            UserDefaults.standard.set(value, forKey: key)
            call.resolve(["success": true])
            return
        }
        call.resolve(["success": false, "error": "Empty key"])
    }

    @objc func readPreference(_ call: CAPPluginCall) {
        let key = (call.options["key"] as? String) ?? ""
        if !key.isEmpty {
            let value = UserDefaults.standard.string(forKey: key)
            call.resolve(["success": true, "value": value as Any])
            return
        }
        call.resolve(["success": false, "error": "Empty key"])
    }
}

