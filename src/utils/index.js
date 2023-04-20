/* eslint-disable camelcase */

const mapDBToAlbumsModel = ({
  id,
  name,
  year
}) => ({
  id,
  name,
  year: parseInt(year)
})

module.exports = { mapDBToAlbumsModel }
