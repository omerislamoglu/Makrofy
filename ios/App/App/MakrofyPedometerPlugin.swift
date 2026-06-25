import Foundation
import Capacitor
import CoreMotion

@objc(MakrofyPedometerPlugin)
public class MakrofyPedometerPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "MakrofyPedometerPlugin"
    public let jsName = "MakrofyPedometer"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "getToday", returnType: CAPPluginReturnPromise)
    ]

    private let pedometer = CMPedometer()

    // Adım verisi CoreMotion (CMPedometer) ile okunur. CoreMotion yalnızca
    // NSMotionUsageDescription gerektirir; HealthKit entitlement'ine veya ek
    // App Review incelemesine ihtiyaç duymaz. Adımlar iPhone'un kendi
    // hareket çipinden ölçülür.
    @objc public func getToday(_ call: CAPPluginCall) {
        queryPedometerToday(call)
    }

    private func queryPedometerToday(_ call: CAPPluginCall) {
        guard CMPedometer.isStepCountingAvailable() else {
            call.resolve([
                "available": false,
                "steps": 0,
                "distanceMeters": 0,
                "errorMessage": "Step counting is not available on this device"
            ])
            return
        }

        let startOfDay = Calendar.current.startOfDay(for: Date())

        pedometer.queryPedometerData(from: startOfDay, to: Date()) { data, error in
            DispatchQueue.main.async {
                if let error = error {
                    call.resolve([
                        "available": false,
                        "steps": 0,
                        "distanceMeters": 0,
                        "errorMessage": error.localizedDescription
                    ])
                    return
                }

                call.resolve([
                    "available": true,
                    "steps": data?.numberOfSteps.intValue ?? 0,
                    "distanceMeters": data?.distance?.doubleValue ?? 0,
                    "source": "coremotion"
                ])
            }
        }
    }
}
