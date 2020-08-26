//
//  utils.swift
//  MobeyeGeolocation
//
//  Created by Dimitri Desvillechabrol on 06/07/2020.
//  Copyright © 2020 Facebook. All rights reserved.
//

import Foundation
import CoreLocation



enum CustomError: Error {
  case runtimeError(String)
}

/* ios permissions status */
struct PermissionStatus {
  static var DENIED = "denied"
  static var GRANTED = "granted"
  static var NEVER_ASK_AGAIN = "never_ask_again"
}

struct LevelAccuracy {
  static var PowerSaving = "PowerSaving"
  static var BalancedPower = "BalancedPower"
  static var BestAccuracy = "BestAccuracy"
  static var NavigationAccuracy = "NavigationAccuracy"
}

let LocationAccuracyDict = [
  LevelAccuracy.PowerSaving: kCLLocationAccuracyKilometer,
  LevelAccuracy.BalancedPower: kCLLocationAccuracyHundredMeters,
  LevelAccuracy.BestAccuracy: kCLLocationAccuracyBest,
  LevelAccuracy.NavigationAccuracy: kCLLocationAccuracyBestForNavigation
]

enum GeolocationError: Error {
  case LOCATION
  case USER_REJECT_LOCATION
  case NO_LOCATION_AVAILABLE
  case LOCATION_NOT_CONFIGURED
  case BAD_ACCURACY_OPTION

  var info: (code: String, description: String) {
    switch self {
    case .LOCATION:
      return (code: "1", description: "Location failed")
    case .USER_REJECT_LOCATION:
      return (code: "2", description: "User reject to activate his geolocation")
    case .NO_LOCATION_AVAILABLE:
      return (code: "3", description: "No location in buffer")
    case .LOCATION_NOT_CONFIGURED:
      return (code: "10", description: "Location service is not configured")
    case .BAD_ACCURACY_OPTION:
      return (code: "11", description: "Requested accuracy does not exist")
    default:
      return (code: "1000", description: "Default error")
    }
  }
}
