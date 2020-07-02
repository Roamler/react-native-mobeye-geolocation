//
//  MyLocation.swift
//  MobeyeGeolocation
//
//  Created by Dimitri Desvillechabrol on 02/07/2020.
//  Copyright © 2020 Facebook. All rights reserved.
//

import Foundation
import CoreLocation

class MyLocation: NSObject, Codable {
  static let storageKey: String = "\(Bundle.main.bundleIdentifier!).Locations"

  let latitude: Double
  let longitude: Double
  let accuracy: Double
  let time: Double
  
  enum CodingKeys:String,CodingKey
  {
    case latitude
    case longitude
    case accuracy
    case time
  }
  
  init(location: CLLocation) {
    latitude = location.coordinate.latitude
    longitude = location.coordinate.longitude
    accuracy = location.horizontalAccuracy
    time = location.timestamp.timeIntervalSince1970
  }
  
  override public var description: String {
    return "MyLocation: \(latitude) \(longitude) \(accuracy) \(time)"
  }
  
  public func distanceTo(latitude lat: Double, longitude long: Double) -> Double {
    let lat_a = self.degreesToRadians(degrees: lat)
    let lat_b = self.degreesToRadians(degrees: self.latitude)
    let delta_long = self.degreesToRadians(degrees: long - self.longitude)
    let cos_x = sin(lat_a) * sin(lat_b) + cos(lat_a) * cos(lat_b) * cos(delta_long)
    return acos(cos_x) * 6371009
  }
  
  private func degreesToRadians(degrees: Double) -> Double { return degrees * .pi / 180.0 }
}

extension Encodable {
  func asDictionary() throws -> [String: Any] {
    let data = try JSONEncoder().encode(self)
    guard let dictionary = try JSONSerialization.jsonObject(with: data, options: .allowFragments) as? [String: Any] else {
      throw NSError()
    }
    return dictionary
  }
}
