import Promise from 'bluebird'

/**
 * [selectOrganizationFromRegistry description]
 * @param  {String} [token="" }]            [description]
 * @return [type]             [description]
 */
export default function selectOrganizationFromRegistry({
  token=""
}) {
  return new Promise((resolve, reject) => {
    this.mysql.query(`
      SELECT organization
      FROM registry
      WHERE token_address="${token}";
    `, (error, result) => {
      if (error) { reject(error) }
      resolve(result[0].organization)
    })
  })
}
