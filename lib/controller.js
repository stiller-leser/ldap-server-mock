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
  let searchFilter = request.filter.toString();

  // This currently naivly implements a
  // filter type determination - (&(cn=user)(sn=12345)(some=Attribute))
  const filterType = searchFilter[1];

  if (filterType == '|') {
    searchFilter = searchFilter.replace('(|','')
  }

  // Get each part of the filter
  const filters = searchFilter.split(')(');

  const parsedFilters = [];

  // Clean each of the filter and split them into attribute and query
  filters.forEach((filter) => {
    const cleanedFilter = filter.replace('&', '').replace('((', '').replace('))', '').replace('(','').replace(')','');
    parsedFilters.push(cleanedFilter.split('='));
  });

  // Depending on the filter type we need to run
  // different search 'algorithms'
  switch (filterType) {
    case '&':
      resultSet = databaseProvider.getAnd('dn', request.baseObject.toString(), initialDataSet);
      parsedFilters.forEach((query, index) => {
        resultSet = databaseProvider.getAnd(query[0].trim(), query[1].trim(), resultSet);
      });
      break;
    case '|':
      resultSet = databaseProvider.getAnd('dn', request.baseObject.toString(), initialDataSet);
      if (parsedFilters.length % 2 === 0) {
        let andFilters = [];
        const database = resultSet;
        resultSet = [];
        parsedFilters.forEach((query, index) => {
          andFilters.push([parsedFilters.pop(), parsedFilters.pop()]);
        });
        andFilters.forEach((query, index) => {
          let results = databaseProvider.getAnd(query[0][0].trim(), query[0][1].trim(), database);
          results.forEach((result, index) => {
            resultSet.push(result);
          });
        });
      } else {
        response.send('Uhoh, something went wrong');
        response.end();
      }

      break;
    default:
  }
  if (resultSet.length > 0) {
    let resultTpl = {
      dn: '',
      attributes: {}
    };
    let responseSet = [];
    resultSet.forEach((result, index) => {
      let copiedResult = resultTpl;
      copiedResult.dn = result.dn;
      for (let propertyName in result) {
        if (propertyName !== 'dn') {
          copiedResult.attributes[propertyName] = result[propertyName];
        }
      }
      responseSet.push(copiedResult);
    });

    if (responseSet.length == 1) {
      response.send(responseSet[0]);
    } else {
      // TODO: SOMEHOW THIS NEEDS TO REPRESENT A VALID LDAP ANSWER IF THERE ARE MULTIPLE REPONSES
      // WORKAROUND: RETURN ONLY THE FIRST FOUND ITEM
      response.send(responseSet[0]);
    }
  }
  response.end();
};
