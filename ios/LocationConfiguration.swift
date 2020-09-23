//
//  LocationConfiguration.swift
//  MobeyeGeolocation
//
//  Created by Dimitri Desvillechabrol on 15/09/2020.
//

import Foundation


struct LocationConfiguration {
  let desiredAccuracy: LevelAccuracy
  let distanceFilter: Int
  let updateInterval: Int
  let bufferSize: Int
}

extension LocationConfiguration: Codable {
  init(dictionary: NSDictionary) throws {
    self = try JSONDecoder().decode(LocationConfiguration.self, from: JSONSerialization.data(withJSONObject: dictionary))
  }
}
