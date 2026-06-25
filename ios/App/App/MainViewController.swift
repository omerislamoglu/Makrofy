import Capacitor

class MainViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(MakrofyWidgetPlugin())
        bridge?.registerPluginInstance(MakrofyPedometerPlugin())
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        // Kill WKWebView rubber-band bounce so the fixed bottom nav never
        // gets dragged during overscroll. Scrolling happens inside the
        // app's own scroll containers, not the webview itself.
        webView?.scrollView.bounces = false
        webView?.scrollView.alwaysBounceVertical = false
        webView?.scrollView.alwaysBounceHorizontal = false
    }
}
