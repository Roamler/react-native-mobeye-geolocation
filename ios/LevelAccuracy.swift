//
//  LevelAccuracy.swift
//  MobeyeGeolocation
//
//  Created by Dimitri Desvillechabrol on 15/09/2020.
//

import Foundation
import CoreLocation


enum LevelAccuracy: String, Codable {
  case PowerSaving = "PowerSaving"
  case BalancedPower = "BalancedPower"
  case BestAccuracy = "BestAccuracy"
  case NavigationAccuracy = "NavigationAccuracy"
}

let LocationAccuracyDict = [
  LevelAccuracy.PowerSaving: kCLLocationAccuracyKilometer,
  LevelAccuracy.BalancedPower: kCLLocationAccuracyHundredMeters,
  LevelAccuracy.BestAccuracy: kCLLocationAccuracyBest,
  LevelAccuracy.NavigationAccuracy: kCLLocationAccuracyBestForNavigation
]
