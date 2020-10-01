# 3.0.1 / 2020-10-01

- Adding support for OR filters

# 3.0.0 / 2020-05-04

## BREAKING CHANGES

- Using relative paths with options --conf and --database are now relative to the current directory and not relative to the module ldap-server-mock directory.
- No longer tested on NodeJS &lt; 12.4.0 and NPM &lt; 6.9.0

## DEPENDENCIES

- **asn1** has been removed, it wasn't used directly
- **ldapjs** has been upgraded from 1.0.1 to **1.0.2**
- **nopt** has been upgraded from 4.0.1 to **4.0.3**
- **grunt** has been upgraded from 1.0.1 to **1.1.0**
- **grunt-cli** has been upgraded from 1.2.0 to **1.3.2**
- **grunt-eslint** has been upgraded from 20.1.0 to **22.0.0**
- **pre-commit** sub dependencies have been upgraded

# 2.0.0 / 2018-10-16

## BREAKING CHANGES

- Drop support for NodeJS < 8.9.4 and NPM < 5.6.0

## NEW FEATURES

- Add NPM package-lock.json file

## BUG FIXES

- Fix eslint error on Server.js

# 1.0.0 / 2017-10-18

## NEW FEATURES

- Add a basic LDAP server mock to test authentication on applications using an LDAP server
