export interface AppStrings {
  nav: {
    home: string
    history: string
    add: string
    fitness: string
    profile: string
  }
  mealType: {
    breakfast: string
    lunch: string
    dinner: string
    snack: string
  }
  home: {
    dailyGoal: string
    consumed: string
    remaining: string
    recentMeals: string
    records: string
    addMeal: string
    scanMeal: string
    noMeals: string
    noMealsSubtitle: string
    proScansBadge: string
    freeScansBadge: (n: number) => string
  }
  add: {
    title: string
    tabScan: string
    tabRestaurant: string
    tabManual: string
    tabText: string
    tabSearch: string
    scanHint: string
    textPlaceholder: string
    textHint: string
    noMatch: string
    saveAll: string
    searchPlaceholder: string
    searchRestaurant: string
    allRestaurants: string
    noResults: string
    addButton: string
    added: string
    calories: string
    protein: string
    carbs: string
    fat: string
    fiber: string
  }
  history: {
    title: string
    empty: string
    emptySubtitle: string
    filteredEmpty: string
    today: string
    yesterday: string
  }
  fitness: {
    title: string
    subtitle: string
    tabExercises: string
    tabDiets: string
    weightGain: string
    weightLoss: string
    exercises: string
    plans: string
    howTo: string
    watchOnYoutube: string
    targetMuscles: string
    setplan: string
    tips: string
    set: string
    reps: string
    rest: string
    disclaimer: string
    dietDisclaimer: string
    personalTitle: string
    personalSubtitle: string
    yourTarget: string
    recommendedDiet: string
    recommendedFocus: string
    viewPlan: string
    viewExercises: string
    focusReason: {
      lose_weight: string
      maintain: string
      gain_weight: string
    }
    perDay: string
    tabPrograms: string
    programsTitle: string
    programs: string
    level: string
    perWeek: string
    weeklySchedule: string
    warmup: string
    progression: string
    coachTips: string
    recommendedProgram: string
    viewProgram: string
    weeks: string
    yourProgram: string
    retakeSurvey: string
    buildCustom: string
    buildCustomSub: string
    yourDietPlan: string
    buildCustomDiet: string
    buildCustomDietSub: string
  }
  profile: {
    title: string
    settingsTab: string
    profileTab: string
    member: string
    signOut: string
    goPro: string
    goProSub: string
    proMember: string
    proMemberSub: string
    manageSubscription: string
    manageSubscriptionSub: string
    restorePurchase: string
    restorePurchaseSub: string
    usageSection: string
    aiScansUsed: string
    notifications: string
    mealReminders: string
    mealRemindersSub: string
    weeklySummary: string
    weeklySummarySub: string
    promoNotifs: string
    promoNotifsSub: string
    systemNotifs: string
    systemNotifsSub: string
    languageSection: string
    forceEnglish: string
    forceEnglishSub: string
    privacySection: string
    privacyPolicy: string
    privacyPolicySub: string
    dataPreferences: string
    dataPreferencesSub: string
    legalSection: string
    terms: string
    openSource: string
    appVersion: string
    accountSection: string
    myAccount: string
    user: string
    proMemberBadge: string
    active: string
    subscription: string
    restoring: string
    noActiveFound: string
    restoreError: string
    support: string
    contactUs: string
    contactEmail: string
    deleteAccount: string
    deleteAccountSub: string
    deleteTitle: string
    deleteWarning: string
    deleteIrreversible: string
    deleteItems: string[]
    continueButton: string
    cancelButton: string
    confirmTitle: string
    confirmHint: string
    confirmWord: string
    confirmPlaceholder: string
    deleteForever: string
    giveUp: string
    nutritionDisclaimer: string
  }
  paywall: {
    title: string
    subtitle: string
    proFeatures: string
    features: Array<{ label: string; highlighted?: boolean }>
    bestValue: string
    upgrade: string
    restore: string
    dismiss: string
    disclaimer: string
    yearly: string
    quarterly: string
    monthly: string
    perYear: string
    per3Months: string
    perMonthShort: string
    mostPopular: string
    quarterlyAccess: string
    monthlyAccess: string
    savings: (pct: number) => string
    noActiveSubscription: string
    restoreFailed: string
    errorGeneric: string
  }
  scanBanner: {
    usedTitle: string
    usedSubtitle: string
    upgradeLink: string
    remaining: (n: number) => string
  }
  setup: {
    // Step indicators
    step: string        // "Adım" / "Step"
    of: string          // "/" / "of"
    // Step 1 — Goal
    goalTitle: string
    goalSubtitle: string
    loseWeight: string
    loseWeightDesc: string
    maintain: string
    maintainDesc: string
    gainWeight: string
    gainWeightDesc: string
    // Step 2 — Body info
    bodyTitle: string
    bodySubtitle: string
    // Step 3 — Existing plan
    planTitle: string
    planSubtitle: string
    hasPlanYes: string
    hasPlanYesDesc: string
    hasPlanNo: string
    hasPlanNoDesc: string
    // Step 4 — Summary
    summaryTitle: string
    summarySubtitle: string
    yourGoal: string
    dailyCalories: string
    mealPlanTitle: string
    mealPlanSubtitle: string
    proMealPlanTeaser: string   // shown for free users — full plan is Pro
    existingPlanNote: string    // "We'll track your progress against your plan"
    startButton: string
    // Pro lock overlay
    proFeatureTitle: string
    proFeatureSubtitle: string
    unlockPro: string
    // Meal time labels
    mealBreakfast: string
    mealLunch: string
    mealDinner: string
    mealSnack: string
    continueButton: string
    backButton: string
  }
  goals: {
    sectionTitle: string
    setupButton: string
    editButton: string
    calculateButton: string
    savedLabel: string
    sheetTitle: string
    gender: string
    male: string
    female: string
    age: string
    height: string
    weight: string
    activityLevel: string
    fitnessGoal: string
    // Activity levels
    sedentary: string
    sedentaryDesc: string
    light: string
    lightDesc: string
    moderate: string
    moderateDesc: string
    active: string
    activeDesc: string
    veryActive: string
    veryActiveDesc: string
    // Goals
    loseWeight: string
    loseWeightDesc: string
    maintain: string
    maintainDesc: string
    gainWeight: string
    gainWeightDesc: string
    // Result / display
    dailyCalories: string
    dailyMacros: string
    bmrLabel: string
    tdeeLabel: string
    bmiLabel: string
    notSetup: string
    notSetupDesc: string
    years: string
    cmUnit: string
    kgUnit: string
    // BMI categories
    underweight: string
    normal: string
    overweight: string
    obese: string
  }
  workout: {
    // Page header
    title: string
    subtitle: string
    entryCard: string
    entryCardSub: string

    // No-program state
    noProgramTitle: string
    noProgramSubtitle: string
    createCustom: string
    createCustomSub: string
    useMakrofy: string
    useMakrofySub: string
    generateFromProgram: string
    generateFromProgramDisabled: string

    // Program editor
    programTitle: string
    programSubtitle: string
    editProgram: string
    saveProgram: string
    programSaved: string
    programName: string
    addDay: string
    addExercise: string
    deleteDay: string
    deleteExercise: string
    dayPlaceholder: string
    exercisePlaceholder: string
    notesPlaceholder: string
    confirmDeleteDay: string
    confirmDeleteExercise: string
    defaultWeight: string
    backToTracker: string
    deleteProgram: string
    confirmDeleteProgram: string
    makrofyBadge: string
    customBadge: string
    makrofyDisclaimer: string

    // Weekly log
    weekLabel: string
    thisWeek: string
    sets: string
    reps: string
    weight: string
    notes: string
    kg: string
    prevWeight: string
    save: string
    saved: string
    saving: string
    emptyWeekTitle: string
    emptyWeekSubtitle: string
    startWeek: string
    weekCreated: string
    noExercises: string
  }
  auth: {
    tagline: string
    continueApple: string
    continueGoogle: string
    continueEmail: string
    or: string
    back: string
    signIn: string
    signUp: string
    emailPlaceholder: string
    passwordPlaceholder: string
    passwordSignupPlaceholder: string
    forgotPassword: string
    createAccount: string
    alreadyHaveAccount: string
    resetTitle: string
    resetSubtitle: string
    resetLinkSent: string
    resetEmailSent: (email: string) => string
    sendResetLink: string
    footerTerms: string
    footerTermsLink: string
    footerAnd: string
    footerPrivacyLink: string
    footerAccept: string
  }
  analysis: {
    pageTitle: string
    aiSubtitle: string
    reAnalyze: string
    estimatedResults: string
    adjustGramsHint: string
    estimatedTotalKcal: string
    detectedFoods: string
    itemCount: (n: number) => string
    noItemsLeft: string
    noItemsHint: string
    foodNameLabel: string
    estimatedGrams: string
    removeItem: string
    addNewFood: string
    addToTodayMeals: string
    mealAddedToLog: string
    reAnalyzeButton: string
    manualAdd: string
    disclaimer: string
    // AddItemInline
    foodNamePlaceholder: string
    gramLabel: string
    kcalLabel: string
    protLabel: string
    carbLabel: string
    fatLabel: string
    cancel: string
    addButton: string
    // Macro labels
    proteinLabel: string
    carbsLabel: string
    fatMacroLabel: string
    fiberLabel: string
    // Cooking methods
    cookingMethods: Record<string, string>
  }
  manual: {
    title: string
    subtitle: string
    quickSelect: string
    mealTypeLabel: string
    foodNameLabel: string
    foodNamePlaceholder: string
    entryUnit: string
    portionGrams: string
    gramsHint: string
    pieceCount: string
    pieceGrams: string
    nutrientsPer100g: string
    calorieLabel: string
    proteinLabel: string
    carbsLabel: string
    fatLabel: string
    fiberLabel: string
    saveAsCustom: string
    saveAsCustomSub: string
    mealSaved: string
    saveButton: string
    disclaimer: string
    loginRequired: string
    saveFailed: string
    fixErrors: (n: number) => string
    foodNameRequired: string
    enterPieceCount: string
    enterValidGrams: string
    enterPieceGrams: string
    fieldRequired: (label: string) => string
    fieldMinZero: (label: string) => string
    noNutrientData: string
  }
  meals: {
    pageTitle: string
    mealsRecorded: (n: number) => string
    loading: string
    noMealsToday: string
    noMealsHint: string
    totalCalories: string
    editMeal: string
    saving: string
    saveButton: string
    updateFailed: string
    moreItems: (n: number) => string
    aiScan: string
    manualSource: string
  }
  addPage: {
    subtitle: string
    // Scan tab
    takePhoto: string
    takePhotoSub: string
    uploadGallery: string
    uploadGallerySub: string
    dropHere: string
    dragHere: string
    analyzingMeal: string
    analyzingWait: string
    analyzeMeal: string
    gramInfoLabel: string
    gramInfoPlaceholder: string
    gramInfoHint: string
    unsupportedFormat: string
    imageTooLarge: string
    fileReadError: string
    cameraFailed: string
    galleryFailed: string
    uploadFailed: string
    analysisFailed: string
    scanOpenAll: string
    scanAvailableAll: string
    scanTip: string
    scanDisclaimer: string
    // Text tab
    whatDidYouEat: string
    separateHint: string
    foodsDetected: (n: number) => string
    examples: string
    detectedFoods: string
    clear: string
    totalNutrients: string
    mealTypeLabel: string
    sessionNotFound: string
    needMatchingFood: string
    mealSaveFailed: string
    mealSaved: string
    foodCount: (n: number) => string
    nutrientDisclaimer: string
    // Text tab — parsed item
    quantity: string
    alternatives: string
    possibleMatches: string
    remove: string
    noMatch: string
    // Manual/search tab
    searchFoodLabel: string
    searchFoodPlaceholder: string
    unitLabel: string
    amountLabel: string
    unitGramMl: string
    totalLabel: string
    mlLabel: string
    gramLabel: string
    mlHint: string
    gramsHint: string
    portionNutrients: string
    mealSavedManual: string
    saveManual: string
    manualDisclaimer: string
    fixErrors: (n: number) => string
    noNutrientData: string
    // Restaurant tab
    searchAllMenus: string
    restaurants: string
    productsFound: (n: number) => string
    noResults: string
    tryDifferent: string
    products: (n: number) => string
    restaurantDisclaimer: string
    restaurantSubDisclaimer: string
    mealAdded: string
    // Unit labels
    unitGram: string
    unitPiece: string
    unitPortion: string
    unitMl: string
    unitPacket: string
    unitSlice: string
    unitBar: string
    unitBox: string
    unitBottle: string
    // Search result empty
    manualEntryHint: string
  }
  common: {
    save: string
    cancel: string
    add: string
    edit: string
    delete: string
    back: string
    close: string
    confirm: string
    loading: string
    error: string
    retry: string
    search: string
    calories: string
    protein: string
    carbs: string
    fat: string
    fiber: string
    kcal: string
    grams: string
    perMonth: string
  }
}
