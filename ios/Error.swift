//
//  Error.swift
//  MobeyeGeolocation
//
//  Created by Dimitri Desvillechabrol on 15/09/2020.
//

import Foundation


enum CustomError: Error {
  case runtimeError(String)
}

enum GeolocationError: Error {
  case USER_REJECT_LOCATION
  case NO_LOCATION_AVAILABLE
  case LOCATION_NOT_CONFIGURED
  case INVALID_CONFIGURATION
  case UNKNOWN_AUTHORIZATION_STATUS

  var info: (code: String, description: String) {
    switch self {
    case .USER_REJECT_LOCATION:
      return (code: "1", description: "User reject geolocation")
    case .NO_LOCATION_AVAILABLE:
      return (code: "2", description: "No location in buffer")
    case .LOCATION_NOT_CONFIGURED:
      return (code: "3", description: "Location service is not configured")
    case .INVALID_CONFIGURATION:
      return (code: "4", description: "Configuration is invalid")
    case .UNKNOWN_AUTHORIZATION_STATUS:
      return (code: "5", description: "Unknown authorization status")
    default:
      return (code: "1000", description: "Default error")
    }
  }
}
