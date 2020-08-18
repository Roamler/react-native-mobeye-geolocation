require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-mobeye-geolocation"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = "https://github.com/Mobeye/react-native-mobeye-geolocation"
  s.license      = package["license"]
  s.authors      = package["author"]
  s.platforms    = { :ios => "10.0" }
  s.source       = { :git => "https://github.com/Mobeye/react-native-mobeye-geolocation.git", :tag => "#{s.version}" }
  s.swift_versions = "5.0"

  s.source_files = "ios/**/*.{h,c,m,swift}"
  s.requires_arc = true

  s.dependency "React"
end

