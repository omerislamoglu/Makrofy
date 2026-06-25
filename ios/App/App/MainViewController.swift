import Capacitor

class MainViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(MakrofyWidgetPlugin())
        bridge?.registerPluginInstance(MakrofyPedometerPlugin())
    }
}
