//
//  RingBuffer.swift
//  MobeyeGeolocation
//
//  Created by Dimitri Desvillechabrol on 01/07/2020.
//  Copyright © 2020 Facebook. All rights reserved.
//

import Foundation

/**
 Ring buffer implementation to store computed locations.
 It is a FIFO constant in memory with complexity O(1) for element insertion and deletion.
 */
public struct RingBuffer<T>: Sequence {
  fileprivate var array: ContiguousArray<T?>
  fileprivate var readIndex = 0
  fileprivate var writeIndex = 0
  
  public init(_ size: Int) {
    array = ContiguousArray<T?>(repeating: nil, count: size)
  }
  
  public init(_ size: Int, array a: Array<T>) throws {
    /* handle the case that the buffer size is changed */
    let sliceSize = size > a.count ? a.count : size
    array = ContiguousArray<T?>(repeating: nil, count: size)
    for (i, location) in a[..<sliceSize].enumerated() {
      array[i] = location
    }
    writeIndex = a.count
  }
  
  /**
   Add element in buffer and remove first element if the buffer is full
   
   - Parameter element: Element to add in buffer
   */
  public mutating func add(_ element: T) -> Void {
    array[writeIndex % array.count] = element
    /* if the buffer is full shift the read index */
    if isFull {
      readIndex += 1
    }
    writeIndex += 1
  }
  
  /**
   Get the last element added to the buffer.
   - Returns: last element added to the buffer.
   */
  public func getLast() -> T? {
    if isEmpty {
      return nil
    }
    return array[(writeIndex - 1) % array.count]
  }
  
  /**
   Gets the RingBuffer as an array ordered from the oldest to the most recent element.
   
   - Returns: An ArraySlice ordered from the oldest to the most recent element.
   */
  public func getArray() -> ArraySlice<T?>? {
    if isEmpty {
      return nil
    }
    let startIndex = self.readIndex % array.count
    let endIndex = self.writeIndex % array.count - 1 // SliceArray endpoint is inclusive
    if startIndex <= endIndex {
      return array[startIndex...endIndex]
    } else if endIndex == -1 {
      return array[startIndex...] // case where start and end are index 0
    }
    return array[startIndex...] + array[...endIndex]
  }
  
  fileprivate var availableSpaceForReading: Int {
    return writeIndex - readIndex
  }
  
  fileprivate var availableSpaceForWriting: Int {
    return array.count - availableSpaceForReading
  }
  /**
   Check if the RingBuffer is empty.
   */
  public var isEmpty: Bool {
    return availableSpaceForReading == 0
  }
  
  /**
   Check if the RingBuffer is full.
   */
  public var isFull: Bool {
    return availableSpaceForWriting == 0
  }
  
  /**
   Iterator from the newest to the oldest element.
   
   - Returns: RingBufferIterator
   */
  public func makeIterator() -> RingBufferIterator<T> {
    return RingBufferIterator(self)
  }
}

public struct RingBufferIterator<T>: IteratorProtocol {
  
  let ringBuffer: RingBuffer<T>
  let lastIndex: Int
  let count: Int
  var curIndex: Int
  
  init(_ ringBuffer: RingBuffer<T>) {
    self.ringBuffer = ringBuffer
    self.curIndex = ringBuffer.writeIndex - 1 // write index is excluding endpoint
    self.lastIndex = ringBuffer.readIndex
    self.count = ringBuffer.array.count
  }
  
  public mutating func next() -> T? {
    guard self.curIndex >= self.lastIndex
      else {return nil}
    let nextElement = self.ringBuffer.array[self.curIndex % self.count]
    self.curIndex -= 1
    return nextElement
  }
}
