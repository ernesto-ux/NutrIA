#!/usr/bin/env swift
// log-to-health.swift
// Logs nutrition data from NutrIA JSON export to Apple Health
// Usage: swift log-to-health.swift /tmp/nutria-health-export.json

import HealthKit
import Foundation

let healthStore = HKHealthStore()

// Nutrition types to log
let calorieType = HKQuantityType.quantityType(forIdentifier: .dietaryEnergyConsumed)!
let proteinType = HKQuantityType.quantityType(forIdentifier: .dietaryProtein)!
let carbsType = HKQuantityType.quantityType(forIdentifier: .dietaryCarbohydrates)!
let fatType = HKQuantityType.quantityType(forIdentifier: .dietaryFatTotal)!

let typesToShare: Set<HKSampleType> = [calorieType, proteinType, carbsType, fatType]

struct DayEntry: Codable {
    let date: String
    let calories: Int
    let protein: Double
    let carbs: Double
    let fat: Double
    let items_count: Int
}

// Parse args
guard CommandLine.arguments.count > 1 else {
    print("Usage: swift log-to-health.swift /tmp/nutria-health-export.json")
    exit(1)
}

let jsonPath = CommandLine.arguments[1]
guard let jsonData = FileManager.default.contents(atPath: jsonPath) else {
    print("Error: Cannot read \(jsonPath)")
    exit(1)
}

let entries: [DayEntry]
do {
    entries = try JSONDecoder().decode([DayEntry].self, from: jsonData)
} catch {
    print("Error parsing JSON: \(error)")
    exit(1)
}

guard HKHealthStore.isHealthDataAvailable() else {
    print("Error: HealthKit not available on this device")
    exit(1)
}

let semaphore = DispatchSemaphore(value: 0)

// Request authorization
healthStore.requestAuthorization(toShare: typesToShare, read: []) { success, error in
    if let error = error {
        print("Auth error: \(error.localizedDescription)")
        semaphore.signal()
        return
    }
    guard success else {
        print("Authorization denied")
        semaphore.signal()
        return
    }

    let dateFormatter = DateFormatter()
    dateFormatter.dateFormat = "yyyy-MM-dd"

    var samples: [HKQuantitySample] = []

    for entry in entries {
        guard let date = dateFormatter.date(from: entry.date) else {
            print("Skipping invalid date: \(entry.date)")
            continue
        }

        // Set time to noon for the day
        let calendar = Calendar.current
        let noon = calendar.date(bySettingHour: 12, minute: 0, second: 0, of: date)!
        let end = calendar.date(bySettingHour: 23, minute: 59, second: 0, of: date)!

        let metadata: [String: Any] = ["HKMetadataKeyFoodType": "NutrIA Daily Total"]

        // Calories
        let calSample = HKQuantitySample(
            type: calorieType,
            quantity: HKQuantity(unit: .kilocalorie(), doubleValue: Double(entry.calories)),
            start: noon, end: end,
            metadata: metadata
        )
        samples.append(calSample)

        // Protein
        let protSample = HKQuantitySample(
            type: proteinType,
            quantity: HKQuantity(unit: .gram(), doubleValue: entry.protein),
            start: noon, end: end,
            metadata: metadata
        )
        samples.append(protSample)

        // Carbs
        let carbSample = HKQuantitySample(
            type: carbsType,
            quantity: HKQuantity(unit: .gram(), doubleValue: entry.carbs),
            start: noon, end: end,
            metadata: metadata
        )
        samples.append(carbSample)

        // Fat
        let fatSample = HKQuantitySample(
            type: fatType,
            quantity: HKQuantity(unit: .gram(), doubleValue: entry.fat),
            start: noon, end: end,
            metadata: metadata
        )
        samples.append(fatSample)

        print("Prepared: \(entry.date) - \(entry.calories) kcal | \(entry.protein)g prot | \(entry.carbs)g carbs | \(entry.fat)g fat")
    }

    // Save all samples
    healthStore.save(samples) { success, error in
        if success {
            print("\nLogged \(samples.count) samples (\(entries.count) days) to Apple Health")
        } else {
            print("Error saving: \(error?.localizedDescription ?? "unknown")")
        }
        semaphore.signal()
    }
}

semaphore.wait()
