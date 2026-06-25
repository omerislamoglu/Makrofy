import WidgetKit
import SwiftUI

private let makrofyWidgetSuiteName = "group.com.omerislamoglu.makrofy"

// MARK: - Widget Localization (runtime, no .strings files needed)

private struct WL {
    static let lang: String = {
        let code = Locale.preferredLanguages.first?.prefix(2) ?? "en"
        return String(code)
    }()

    static var remaining: String {
        switch lang {
        case "tr": return "kalan"
        case "de": return "übrig"
        case "fr": return "restant"
        case "es": return "restante"
        case "it": return "rimanente"
        default:   return "left"
        }
    }

    static var kcalRemaining: String {
        switch lang {
        case "tr": return "kcal kalan"
        case "de": return "kcal übrig"
        case "fr": return "kcal restant"
        case "es": return "kcal restante"
        case "it": return "kcal rimanente"
        default:   return "kcal left"
        }
    }

    static var carbs: String {
        switch lang {
        case "tr": return "Karb"
        case "de": return "Kohle"
        case "fr": return "Gluc"
        case "es": return "Carb"
        case "it": return "Carb"
        default:   return "Carbs"
        }
    }

    static var fat: String {
        switch lang {
        case "tr": return "Yağ"
        case "de": return "Fett"
        case "fr": return "Lip"
        case "es": return "Grasa"
        case "it": return "Grassi"
        default:   return "Fat"
        }
    }

    static var upgradeToPro: String {
        switch lang {
        case "tr": return "Widget'ı kullanmak için\nPro'ya geç"
        case "de": return "Upgrade auf Pro\num das Widget zu nutzen"
        case "fr": return "Passez à Pro\npour utiliser le widget"
        case "es": return "Cambia a Pro\npara usar el widget"
        case "it": return "Passa a Pro\nper usare il widget"
        default:   return "Upgrade to Pro\nto use the widget"
        }
    }

    static var widgetDescription: String {
        switch lang {
        case "tr": return "Günlük kalori ve makro takibi."
        case "de": return "Tägliche Kalorien- und Makro-Übersicht."
        case "fr": return "Suivi quotidien des calories et macros."
        case "es": return "Seguimiento diario de calorías y macros."
        case "it": return "Monitoraggio giornaliero di calorie e macro."
        default:   return "Daily calorie and macro tracking."
        }
    }
}

// MARK: - Entry

struct MakrofyWidgetEntry: TimelineEntry {
    let date: Date
    let isPro: Bool
    let calories: Int
    let protein: Int
    let carbs: Int
    let fat: Int
    let steps: Int
    let burnedCalories: Int
    let calorieGoal: Int
    let proteinGoal: Int
    let carbsGoal: Int
    let fatGoal: Int
    let remainingCalories: Int
    let workoutNote: String
}

// MARK: - Provider

struct MakrofyWidgetProvider: TimelineProvider {
    func placeholder(in context: Context) -> MakrofyWidgetEntry {
        MakrofyWidgetEntry(
            date: Date(),
            isPro: true,
            calories: 1420,
            protein: 96,
            carbs: 145,
            fat: 42,
            steps: 7820,
            burnedCalories: 235,
            calorieGoal: 2200,
            proteinGoal: 150,
            carbsGoal: 250,
            fatGoal: 70,
            remainingCalories: 780,
            workoutNote: ""
        )
    }

    func getSnapshot(in context: Context, completion: @escaping (MakrofyWidgetEntry) -> Void) {
        completion(readEntry())
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<MakrofyWidgetEntry>) -> Void) {
        let entry = readEntry()
        let nextRefresh = Calendar.current.date(byAdding: .minute, value: 30, to: Date()) ?? Date()
        completion(Timeline(entries: [entry], policy: .after(nextRefresh)))
    }

    private func readEntry() -> MakrofyWidgetEntry {
        let defaults = UserDefaults(suiteName: makrofyWidgetSuiteName)
        let calorieGoal = max(defaults?.integer(forKey: "calorieGoal") ?? 2200, 1)

        // Detect a rolled-over day: if the stored totals belong to a previous
        // calendar day (the app hasn't synced yet today), show a fresh day
        // instead of yesterday's stale numbers. Day key is computed the same way
        // as the JS `getToday()` (device-local, Gregorian, yyyy-MM-dd).
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.calendar = Calendar(identifier: .gregorian)
        formatter.dateFormat = "yyyy-MM-dd"
        let today = formatter.string(from: Date())
        let storedDate = defaults?.string(forKey: "logDate") ?? ""
        let isStale = !storedDate.isEmpty && storedDate != today

        let calories = isStale ? 0 : (defaults?.integer(forKey: "calories") ?? 0)
        let protein = isStale ? 0 : (defaults?.integer(forKey: "protein") ?? 0)
        let carbs = isStale ? 0 : (defaults?.integer(forKey: "carbs") ?? 0)
        let fat = isStale ? 0 : (defaults?.integer(forKey: "fat") ?? 0)
        let steps = isStale ? 0 : (defaults?.integer(forKey: "steps") ?? 0)
        let burnedCalories = isStale ? 0 : (defaults?.integer(forKey: "burnedCalories") ?? 0)
        let remainingCalories = isStale
            ? calorieGoal
            : (defaults?.integer(forKey: "remainingCalories") ?? calorieGoal)
        let workoutNote = isStale ? "" : (defaults?.string(forKey: "workoutNote") ?? "")

        return MakrofyWidgetEntry(
            date: Date(),
            isPro: defaults?.bool(forKey: "isPro") ?? false,
            calories: calories,
            protein: protein,
            carbs: carbs,
            fat: fat,
            steps: steps,
            burnedCalories: burnedCalories,
            calorieGoal: calorieGoal,
            proteinGoal: max(defaults?.integer(forKey: "proteinGoal") ?? 150, 1),
            carbsGoal: max(defaults?.integer(forKey: "carbsGoal") ?? 250, 1),
            fatGoal: max(defaults?.integer(forKey: "fatGoal") ?? 70, 1),
            remainingCalories: remainingCalories,
            workoutNote: workoutNote
        )
    }
}

// MARK: - Colors

private let accentAmber = Color(red: 245/255, green: 158/255, blue: 11/255)
private let proteinBlue = Color(red: 96/255, green: 165/255, blue: 250/255)
private let carbGreen = Color(red: 74/255, green: 222/255, blue: 128/255)
private let fatOrange = Color(red: 251/255, green: 146/255, blue: 60/255)
private let surfaceColor = Color.white.opacity(0.06)
private let subtleText = Color.white.opacity(0.35)
private let dimText = Color.white.opacity(0.55)

// MARK: - Main View

struct MakrofyWidgetView: View {
    @Environment(\.widgetFamily) private var family
    let entry: MakrofyWidgetEntry

    private var content: some View {
        Group {
            if entry.isPro {
                if family == .systemMedium {
                    mediumContent
                } else {
                    smallContent
                }
            } else {
                lockedContent
            }
        }
    }

    var body: some View {
        content
            .widgetURL(URL(string: "makrofy://home"))
    }

    // MARK: - Small Widget

    private var smallContent: some View {
        let progress = min(Double(entry.calories) / Double(max(entry.calorieGoal, 1)), 1.0)

        return GeometryReader { geo in
            let isCompact = geo.size.height < 148
            let ringSize: CGFloat = isCompact ? 58 : 72
            let ringStroke: CGFloat = isCompact ? 4.5 : 5.5
            let calFont: CGFloat = isCompact ? 16 : 20
            let pad: CGFloat = isCompact ? 10 : 12

            VStack(spacing: 0) {
                // Top: Brand
                HStack {
                    Text("Makrofy")
                        .font(.system(size: isCompact ? 9 : 10, weight: .bold, design: .rounded))
                        .foregroundColor(.white.opacity(0.7))
                    Spacer()
                    Image(systemName: "flame.fill")
                        .font(.system(size: isCompact ? 7 : 8))
                        .foregroundColor(accentAmber)
                }

                Spacer(minLength: 2)

                // Center: Calorie Ring
                ZStack {
                    Circle()
                        .stroke(surfaceColor, lineWidth: ringStroke)

                    Circle()
                        .trim(from: 0, to: progress)
                        .stroke(
                            progress > 0.9 ? Color.red : accentAmber,
                            style: StrokeStyle(lineWidth: ringStroke, lineCap: .round)
                        )
                        .rotationEffect(.degrees(-90))
                        .animation(.easeOut(duration: 0.5), value: progress)

                    VStack(spacing: 0) {
                        Text("\(entry.remainingCalories)")
                            .font(.system(size: calFont, weight: .black, design: .rounded))
                            .foregroundColor(.white)
                            .minimumScaleFactor(0.5)
                            .lineLimit(1)
                        Text(WL.remaining)
                            .font(.system(size: isCompact ? 7 : 8, weight: .semibold))
                            .foregroundColor(subtleText)
                    }
                }
                .frame(width: ringSize, height: ringSize)

                Spacer(minLength: 2)

                // Bottom: Macro pills
                HStack(spacing: isCompact ? 2 : 3) {
                    macroPill("P", entry.protein, proteinBlue, compact: isCompact)
                    macroPill("C", entry.carbs, carbGreen, compact: isCompact)
                    macroPill("F", entry.fat, fatOrange, compact: isCompact)
                }
            }
            .padding(pad)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
    }

    // MARK: - Medium Widget

    private var mediumContent: some View {
        let progress = min(Double(entry.calories) / Double(max(entry.calorieGoal, 1)), 1.0)

        return GeometryReader { geo in
            let isShort = geo.size.height < 148

            HStack(spacing: 12) {
                // Left: Ring + calorie info
                VStack(spacing: isShort ? 4 : 8) {
                    HStack {
                        Text("Makrofy")
                            .font(.system(size: isShort ? 10 : 12, weight: .bold, design: .rounded))
                            .foregroundColor(.white.opacity(0.7))
                        Spacer()
                    }

                    ZStack {
                        Circle()
                            .stroke(surfaceColor, lineWidth: isShort ? 5 : 7)

                        Circle()
                            .trim(from: 0, to: progress)
                            .stroke(
                                progress > 0.9 ? Color.red : accentAmber,
                                style: StrokeStyle(lineWidth: isShort ? 5 : 7, lineCap: .round)
                            )
                            .rotationEffect(.degrees(-90))

                        VStack(spacing: 1) {
                            Text("\(entry.remainingCalories)")
                                .font(.system(size: isShort ? 20 : 26, weight: .black, design: .rounded))
                                .foregroundColor(.white)
                                .minimumScaleFactor(0.5)
                                .lineLimit(1)
                            Text(WL.kcalRemaining)
                                .font(.system(size: isShort ? 7 : 9, weight: .semibold))
                                .foregroundColor(subtleText)
                        }
                    }
                    .frame(width: isShort ? 70 : 90, height: isShort ? 70 : 90)

                    // Steps row
                    HStack(spacing: 3) {
                        Image(systemName: "figure.walk")
                            .font(.system(size: isShort ? 7 : 8, weight: .semibold))
                            .foregroundColor(dimText)
                        Text("\(entry.steps)")
                            .font(.system(size: isShort ? 9 : 10, weight: .bold, design: .rounded))
                            .foregroundColor(dimText)
                        Text("·")
                            .foregroundColor(subtleText)
                        Image(systemName: "flame")
                            .font(.system(size: isShort ? 7 : 8, weight: .semibold))
                            .foregroundColor(dimText)
                        Text("\(entry.burnedCalories)")
                            .font(.system(size: isShort ? 9 : 10, weight: .bold, design: .rounded))
                            .foregroundColor(dimText)
                    }
                }
                .frame(maxWidth: .infinity)

                // Right: Macro bars
                VStack(spacing: isShort ? 4 : 6) {
                    Spacer(minLength: 0)

                    macroBarRow("Protein", value: entry.protein, goal: entry.proteinGoal, color: proteinBlue)
                    macroBarRow(WL.carbs, value: entry.carbs, goal: entry.carbsGoal, color: carbGreen)
                    macroBarRow(WL.fat, value: entry.fat, goal: entry.fatGoal, color: fatOrange)

                    Spacer(minLength: 0)

                    if !entry.workoutNote.isEmpty {
                        workoutNotePill(entry.workoutNote, compact: isShort)
                    }

                    // Calorie summary
                    HStack(spacing: 0) {
                        Text("\(entry.calories)")
                            .font(.system(size: isShort ? 10 : 11, weight: .bold, design: .rounded))
                            .foregroundColor(.white)
                        Text(" / \(entry.calorieGoal) kcal")
                            .font(.system(size: isShort ? 8 : 10, weight: .medium))
                            .foregroundColor(subtleText)
                    }
                }
                .frame(maxWidth: .infinity)
            }
            .padding(isShort ? 10 : 14)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
    }

    // MARK: - Locked Content

    private var lockedContent: some View {
        GeometryReader { geo in
            let isCompact = geo.size.height < 148

            VStack(spacing: isCompact ? 6 : 10) {
                Spacer(minLength: 0)

                Image(systemName: "lock.fill")
                    .font(.system(size: isCompact ? 16 : 22))
                    .foregroundColor(accentAmber)

                Text("Makrofy Pro")
                    .font(.system(size: isCompact ? 13 : 16, weight: .bold, design: .rounded))
                    .foregroundColor(.white)

                if !isCompact {
                    Text(WL.upgradeToPro)
                        .font(.system(size: 11, weight: .medium))
                        .foregroundColor(dimText)
                        .multilineTextAlignment(.center)
                        .lineLimit(2)
                }

                Spacer(minLength: 0)
            }
            .padding(isCompact ? 10 : 14)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
    }

    // MARK: - Small Widget Components

    private func macroPill(_ label: String, _ value: Int, _ color: Color, compact: Bool = false) -> some View {
        HStack(spacing: compact ? 2 : 3) {
            Circle()
                .fill(color)
                .frame(width: compact ? 4 : 5, height: compact ? 4 : 5)
            Text("\(value)g")
                .font(.system(size: compact ? 8 : 10, weight: .bold, design: .rounded))
                .foregroundColor(.white.opacity(0.8))
                .minimumScaleFactor(0.7)
                .lineLimit(1)
        }
        .padding(.horizontal, compact ? 5 : 7)
        .padding(.vertical, compact ? 3 : 4)
        .background(surfaceColor)
        .clipShape(Capsule())
    }

    // MARK: - Medium Widget Components

    private func macroBarRow(_ label: String, value: Int, goal: Int, color: Color) -> some View {
        let progress = min(Double(value) / Double(max(goal, 1)), 1.0)

        return VStack(alignment: .leading, spacing: 3) {
            HStack {
                Text(label)
                    .font(.system(size: 10, weight: .semibold))
                    .foregroundColor(dimText)
                Spacer()
                Text("\(value)")
                    .font(.system(size: 10, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
                Text("/\(goal)g")
                    .font(.system(size: 9, weight: .medium))
                    .foregroundColor(subtleText)
            }

            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    Capsule()
                        .fill(surfaceColor)
                        .frame(height: 4)

                    Capsule()
                        .fill(color)
                        .frame(width: max(geo.size.width * progress, 2), height: 4)
                }
            }
            .frame(height: 4)
        }
    }

    private func workoutNotePill(_ text: String, compact: Bool) -> some View {
        HStack(spacing: 4) {
            Image(systemName: "dumbbell.fill")
                .font(.system(size: compact ? 7 : 8, weight: .semibold))
                .foregroundColor(accentAmber)
            Text(text)
                .font(.system(size: compact ? 8 : 9, weight: .bold, design: .rounded))
                .foregroundColor(.white.opacity(0.78))
                .lineLimit(1)
                .minimumScaleFactor(0.75)
        }
        .padding(.horizontal, compact ? 6 : 7)
        .padding(.vertical, compact ? 3 : 4)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(surfaceColor)
        .clipShape(Capsule())
    }
}

// MARK: - Widget Configuration

@main
struct MakrofyWidget: Widget {
    let kind = "MakrofyWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: MakrofyWidgetProvider()) { entry in
            if #available(iOSApplicationExtension 17.0, *) {
                MakrofyWidgetView(entry: entry)
                    .containerBackground(.black, for: .widget)
            } else {
                MakrofyWidgetView(entry: entry)
                    .background(Color.black)
            }
        }
        .configurationDisplayName("Makrofy")
        .description(WL.widgetDescription)
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}
