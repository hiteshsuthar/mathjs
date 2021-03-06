'use strict'

import { factory } from '../../utils/factory'
import { getSafeProperty } from '../../utils/customs'
import { embeddedDocs } from '../embeddedDocs/embeddedDocs'

const name = 'help'
const dependencies = ['typed', 'math', 'Help']

export const createHelp = /* #__PURE__ */ factory(name, dependencies, ({ typed, math, Help }) => {
  /**
   * Retrieve help on a function or data type.
   * Help files are retrieved from the embedded documentation in math.docs.
   *
   * Syntax:
   *
   *    math.help(search)
   *
   * Examples:
   *
   *    console.log(math.help('sin').toString())
   *    console.log(math.help(math.add).toString())
   *    console.log(math.help(math.add).toJSON())
   *
   * @param {Function | string | Object} search   A function or function name
   *                                              for which to get help
   * @return {Help} A help object
   */
  return typed(name, {
    'any': function (search) {
      let prop
      let searchName = search

      if (typeof search !== 'string') {
        for (prop in math) {
          // search in functions and constants
          if (math.hasOwnProperty(prop) && (search === math[prop])) {
            searchName = prop
            break
          }
        }

        /* TODO: implement help for data types
         if (!text) {
         // search data type
         for (prop in math.type) {
         if (math.hasOwnProperty(prop)) {
         if (search === math.type[prop]) {
         text = prop
         break
         }
         }
         }
         }
         */
      }

      const doc = getSafeProperty(embeddedDocs, searchName)
      if (!doc) {
        throw new Error('No documentation found on "' + searchName + '"')
      }
      return new Help(doc)
    }
  })
})
