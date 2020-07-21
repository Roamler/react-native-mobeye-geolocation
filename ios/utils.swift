//
//  utils.swift
//  MobeyeGeolocation
//
//  Created by Dimitri Desvillechabrol on 06/07/2020.
//  Copyright © 2020 Facebook. All rights reserved.
//

import Foundation


enum CustomError: Error {
  case runtimeError(String)
}

/* ios permissions status */
struct PermissionStatus {
  static var DENIED = "denied"
  static var GRANTED = "granted"
  static var NEVER_ASK_AGAIN = "never_ask_again"
}

/* Geolocation error */
enum BusinessError: Error {
  case LOCATION
  case USER_REJECT_LOCATION
  case NO_LOCATION_AVAILABLE

  var info: (code: String, description: String) {
    switch self {
    case .LOCATION:
      return (code: "5", description: "Location failed")
    case .USER_REJECT_LOCATION:
      return (code: "50", description: "User reject to activate his geolocation")
    case .NO_LOCATION_AVAILABLE:
      return (code: "51", description: "No location in buffer")
    default:
      return (code: "1000", description: "Default error")
    }
  }
}
