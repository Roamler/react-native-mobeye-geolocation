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
  case NO_LOCATION_AVAILABLE
  case LOCATION_NOT_CONFIGURED
  case INVALID_CONFIGURATION
  case UNKNOWN_AUTHORIZATION_STATUS
  case UNKNOWN_ACCURACY_AUTHORIZATION
  case CHECK_SETTINGS_FAILURE
  case AUTHORIZATION_DENIED
  case HEADING_FAILURE

  var info: (code: String, description: String) {
    switch self {
    case .NO_LOCATION_AVAILABLE:
      return (code: "2", description: "No location in buffer")
    case .LOCATION_NOT_CONFIGURED:
      return (code: "3", description: "Location service is not configured")
    case .INVALID_CONFIGURATION:
      return (code: "4", description: "Configuration is invalid")
    case .UNKNOWN_AUTHORIZATION_STATUS:
      return (code: "5", description: "Unknown authorization status")
    case .UNKNOWN_ACCURACY_AUTHORIZATION:
      return (code: "6", description: "Unknown accuracy authorization")
    /* Android only
    case .CHECK_SETTINGS_FAILURE:
      return (code: "7", description: "Check settings request failure")
    */
    case .AUTHORIZATION_DENIED:
      return (code: "8", description: "User unauthorized the location update")
    case .HEADING_FAILURE:
      return (code: "9", description: "Location not determined: too strong interference from nearby magnetic fields")
    default:
      return (code: "1000", description: "Default error")
    }
  }
}
