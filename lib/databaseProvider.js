'use strict';

/**
 * Fetches from database.
 * @method get
 * @static
 * @params {String} attribute, query, dataSet
 * @return {String} The result set
 */
module.exports.getAnd = (attribute, query, dataSet) => {
  let results = [];
  var BreakException = {};
  try {
    dataSet.forEach((item) => {
      const lowercaseItem = Object.fromEntries(
        Object.entries(item).map(([k, v]) => [k.toLowerCase(), v])
      );

      let currentItem = lowercaseItem[attribute];
      if (currentItem == undefined) throw BreakException;
      if (typeof currentItem === 'object') {
        if (currentItem.includes(query)) {
          results.push(item);
        }
      } else {
        currentItem = currentItem
          .replace(/\s/g, '')
          .replace(/\(/g, '\\28')
          .replace(/\)/g, '\\29')
          .replace(/\*/g, '\\2A')
          .replace(/\\/g, '&#92;')
          .toLowerCase();
        query = query.replace(/\s/g, '').replace(/\\/g, '&#92;').toLowerCase();

        // use RegExp for matching
        let re = new RegExp('^' + query.replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
        if (re.test(currentItem)) {
          results.push(item);
        }
      }
    });
  } catch (e) {
    if (e !== BreakException) throw e;
  }

  return results;
};
