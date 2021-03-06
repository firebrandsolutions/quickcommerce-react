import { EventEmitter } from 'events'
import { Dispatcher } from 'flux'
import ObjectHelper from '../helpers/Object.js'
import SpringDateHelper from '../helpers/SpringDate.js'

import HashProxy from '../utils/HashProxy.js'

class BaseStore extends EventEmitter {
  /**
   *
   * @param data
   * @param from
   * @param to
   */
  static normalizePayload = (data, from, to) => {
    return ObjectHelper.recursiveFormatKeys(data, from, to)
  }
  /**
   *
   * @param data
   * @param returnProp
   * @param ignoreValues
   * @returns {*}
   */
  static resolveCodeTypes = (data, returnProp, ignoreValues) => {
    // TODO: Need a mechanism to configure how code types are parsed... callback? Override?
    returnProp = (typeof returnProp === 'string' && returnProp.length > 0) ? returnProp : BaseStore.CODETYPE_NAME

    for (let prop in data) {
      let value = data[prop]

      // Is value a code type?
      // Null check first - hasOwnProperty check on a null will throw a runtime error
      if (data[prop] !== null) {
        if (data[prop].hasOwnProperty('code') && data[prop].hasOwnProperty('version') && data[prop].hasOwnProperty('name') && data[prop].hasOwnProperty(returnProp)) {
          value = data[prop][returnProp]
        }
      }

      data[prop] = value // If null just assign
    }

    return data
  }
  /**
   *
   * @param data
   * @param format
   * @returns {*}
   */
  static resolveDateObjects = (data, format) => {
    for (let prop in data) {
      let value = data[prop]

      // Is value a code type?
      // Null check first - hasOwnProperty check on a null will throw a runtime error
      if (data[prop] !== null) {
        if (data[prop].hasOwnProperty('day') && data[prop].hasOwnProperty('month') && data[prop].hasOwnProperty('year') && data[prop].hasOwnProperty('value')) {
          value = SpringDateHelper.convertToDate(data[prop])
        }
      }

      data[prop] = value // If null just assign
    }

    return data
  }
  /**
   *
   * @param data
   * @param format
   * @returns {*}
   */
  static resolveCurrencyObjects = (data, format) => {
    for (let prop in data) {
      let value = data[prop]

      // Is value a code type?
      // Null check first - hasOwnProperty check on a null will throw a runtime error
      if (data[prop] !== null) {
        if (data[prop].hasOwnProperty('currency') && data[prop].hasOwnProperty('value')) {
          value = [
            '$' + parseFloat(data[prop].value).toFixed(2),
            data[prop].currency
          ].join(' ')
        }
      }

      data[prop] = value // If null just assign
    }

    return data
  }
  /**
   *
   * @param data
   * @param returnProp
   * @param ignoreValues
   * @returns {*}
   */
  static resolveDomainObjects = (data, returnProp, ignoreValues) => {
    try {
      // Resolve code types
      data = BaseStore.resolveCodeTypes(data, returnProp, ignoreValues)
      // Resolve dates
      data = BaseStore.resolveDateObjects(data)
      // Resolve currency
      data = BaseStore.resolveCurrencyObjects(data)
    } catch (err) {
      console.log('Error attempting to resolve domain object')
      console.log(data)
      console.log(err)
    }

    return data
  }

  /**
   *
   * @constructor
   * @param dispatcher
   * @param stores
   */
  constructor(dispatcher, stores) {
    super()
    // HashProxy of flux stores (to waitFor)
    this._stores = stores || new HashProxy()

    dispatcher = dispatcher || null
    if (dispatcher instanceof Dispatcher) {
      this.dispatcher = dispatcher
    } else {
      this.dispatcher = new Dispatcher()
    }
  }

  /**
   *
   * @param key
   * @returns {*}
   */
  getDependentStore(key) {
    return this._stores[key]
  }

  /**
   *
   * @param actionSubscribe
   */
  subscribe(actionSubscribe) {
    if (!(this.dispatcher instanceof Dispatcher)) {
      throw new Error('Failed to provide dispatcher to BaseStore, cannot register actions')
    }

    this.dispatchToken = this.dispatcher.register(actionSubscribe())
  }

  /**
   *
   * @param obj
   */
  emitChange(obj) {
    this.emit('CHANGE', obj)
  }

  /**
   *
   * @param cb
   */
  addChangeListener(cb) {
    this.on('CHANGE', cb)
  }

  /**
   *
   * @param cb
   */
  removeChangeListener(cb) {
    this.removeListener('CHANGE', cb)
  }

  /**
   *
   * @param collectionKey
   * @param key
   * @param keyValue
   * @returns {boolean}
   */
  hasInCollection(collectionKey, key, keyValue) {
    let exists = false
    this.findInCollection(collectionKey, key, keyValue, () => exists = true)

    return exists
  }

  /**
   *
   * @param collection
   * @param key
   * @param keyValue
   * @param onMatch
   * @param onNoMatch
   */
  findInCollection(collection, key, keyValue, onMatch, onNoMatch) {
    collection = (collection instanceof Array) ? collection : []

    let matchIdx = collection.findIndex((item) => {
      let primaryKeyValue = item[key] || null

      let keyType = typeof primaryKeyValue

      switch (keyType) {
        case 'number':
          return ((keyValue === primaryKeyValue) && primaryKeyValue > 0)
        case 'string':
          return ((keyValue === primaryKeyValue) && primaryKeyValue !== null && primaryKeyValue !== '')
        default:
          break
      }
    })

    if (matchIdx > -1) {
      if (typeof onMatch === 'function') onMatch(matchIdx)
    } else {
      if (typeof onNoMatch === 'function') onNoMatch()
    }
  }

  /**
   *
   * @param collection
   * @param callback
   */
  forEachInCollection(collection, callback) {
    collection = (collection instanceof Array) ? collection : []
    if (typeof callback === 'function') collection.forEach(callback)
  }

  /**
   *
   * @param array
   * @param value
   * @returns {*}
   * @private
   */
  _isset(array, value) {
    return BaseStore.isset(array, value)
  }

  /**
   * TODO: I am a utility method move me out of here?
   */
  static isset = (array, value) => {
    return (typeof array[value] !== 'undefined' && array[value] !== null) ? true : false
  }
}

BaseStore.dispatchToken = null
BaseStore.CODETYPE_NAME = 'name'
BaseStore.CODETYPE_ID = 'id'
BaseStore.CODETYPE_CODE = 'code'
BaseStore.PK = 'id'

export default BaseStore
