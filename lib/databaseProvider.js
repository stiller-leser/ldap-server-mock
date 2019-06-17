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
  dataSet.forEach((item) => {
    const lowercaseItem = Object.fromEntries(
      Object.entries(item).map(([k, v]) => [k.toLowerCase(), v])
    );

    const currentItem = lowercaseItem[attribute];
    if (typeof currentItem === 'object') {
      if (currentItem.includes(query)) {
        results.push(item);
      }
    } else if (
      currentItem
        .replace(/\s/g, '')
        .replace(/\\/g, '\\5C')
        .replace(/\(/g, '\\28')
        .replace(/\)/g, '\\29')
        .replace(/\*/g, '\\2A')
        .toLowerCase()
        .localeCompare(
          query.replace(/\s/g, '')
            .toLowerCase()
        ) === 0
    ) {
      results.push(item);
    }
  });

  return results;
};
