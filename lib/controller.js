'use strict';

/**
 * Provides default route action to deal with LDAP protocol.
 *
 * @class controller
 * @static
 */

const databaseProvider = process.require('lib/databaseProvider.js');

/**
 * Manages the database of LDAP users.
 *
 * @class databaseProvider
 * @static
 */

const database = process.require('lib/database.js');

/**
 * Authenticates a user.
 *
 * This is a mock, no verification is performed. User is authenticated.
 *
 * @method bindAction
 * @static
 * @async
 * @param {BindRequest} request LDAP request
 * @param {BindResponse} response LDAP response
 */
module.exports.bindAction = (request, response) => {
  response.end();
};

/**
 * Searches for a particular user.
 *
 * This is a mock, no verification is performed. User login is retrieved from searchFilter parameter using
 * the searchFilter from server configuration.
 *
 * @method searchAction
 * @static
 * @async
 * @param {SearchRequest} request LDAP request
 * @param {Object} request.filter LDAP filters
 * @param {SearchResponse} response LDAP response
 */
module.exports.searchAction = (request, response) => {
  let initialDataSet = database.data;
  let resultSet = [];
  const searchFilter = request.filter.toString();

  // This currently naivly implements a
  // filter type determination - (&(cn=user)(sn=12345)(some=Attribute))
  const filterType = searchFilter[1];

  // Get each part of the filter
  const filters = searchFilter.split(')(');
  const parsedFilters = [['dn', request.baseObject.toString()]];

  // Clean each of the filter and split them into attribute and query
  filters.forEach((filter) => {
    const cleanedFilter = filter.replace('&', '').replace('((', '').replace('))', '');
    parsedFilters.push(cleanedFilter.split('='));
  });

  // Depending on the filter type we need to run
  // different search 'algorithms'
  switch (filterType) {
    case '&':
      parsedFilters.forEach((query, index) => {
        if (index === 0) {
          resultSet = databaseProvider.getAnd(query[0].trim(), query[1].trim(), initialDataSet);
        } else {
          resultSet = databaseProvider.getAnd(query[0].trim(), query[1].trim(), resultSet);
        }
      });
      break;
    default:
  }

  // Currently only one result is supported
  if (resultSet.length > 0) {
    let result = {
      dn: '',
      attributes: {}
    };
    result.dn = resultSet[0].dn;
    for (let propertyName in resultSet[0]) {
      if (propertyName !== 'dn') {
        result.attributes[propertyName] = resultSet[0][propertyName];
      }
    }
    response.send(result);
  }
  response.end();
};
