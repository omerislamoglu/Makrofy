import Foundation
import Capacitor
import WidgetKit

private let makrofyWidgetSuiteName = "group.com.omerislamoglu.makrofy"

@objc(MakrofyWidgetPlugin)
public class MakrofyWidgetPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "MakrofyWidgetPlugin"
    public let jsName = "MakrofyWidget"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "update", returnType: CAPPluginReturnPromise)
    ]

    @objc public func update(_ call: CAPPluginCall) {
        guard let defaults = UserDefaults(suiteName: makrofyWidgetSuiteName) else {
            call.reject("App Group UserDefaults is unavailable")
            return
        }

        defaults.set(call.getBool("isPro", false), forKey: "isPro")
        defaults.set(call.getInt("calories", 0), forKey: "calories")
        defaults.set(call.getInt("protein", 0), forKey: "protein")
        defaults.set(call.getInt("carbs", 0), forKey: "carbs")
        defaults.set(call.getInt("fat", 0), forKey: "fat")
        defaults.set(call.getInt("steps", 0), forKey: "steps")
        defaults.set(call.getInt("burnedCalories", 0), forKey: "burnedCalories")
        defaults.set(call.getInt("calorieGoal", 0), forKey: "calorieGoal")
        defaults.set(call.getInt("proteinGoal", 0), forKey: "proteinGoal")
        defaults.set(call.getInt("carbsGoal", 0), forKey: "carbsGoal")
        defaults.set(call.getInt("fatGoal", 0), forKey: "fatGoal")
        defaults.set(call.getInt("remainingCalories", 0), forKey: "remainingCalories")
        defaults.set(call.getString("workoutNote", ""), forKey: "workoutNote")
        defaults.set(call.getString("updatedAt", ""), forKey: "updatedAt")
        // Local day key (YYYY-MM-DD) so the widget can zero out stale totals
        // once the calendar day rolls over before the app next syncs.
        defaults.set(call.getString("dateKey", ""), forKey: "logDate")

        if #available(iOS 14.0, *) {
            WidgetCenter.shared.reloadTimelines(ofKind: "MakrofyWidget")
        }

        call.resolve()
    }
}
