import Promise from 'bluebird'

/**
 * [insertIntoContribution description]
 * @param  {String} [transactionHash=""] [description]
 * @param  {String} [contributor=""]     [description]
 * @param  {String} [username=""]        [description]
 * @param  {Number} [value=0]            [description]
 * @param  {Number} [reservedValue=0]    [description]
 * @param  {Number} [date=0]             [description]
 * @param  {String} [rewardType=""]      [description]
 * @param  {String} [reservedType=""}]   [description]
 * @return [type]                        [description]
 */
export default function insertIntoContributions({
  transactionHash="",
  contributor="",
  username="",
  value=0,
  reservedValue=0,
  date=0,
  rewardType="",
  reservedType="",
  organization=""
}) {
  return new Promise((resolve, reject) => {
    this.mysql.query(`
      INSERT INTO contributions (
        txHash,
        contributor,
        username,
        value,
        reservedValue,
        date,
        rewardType,
        organization
      ) VALUES (
        "${transactionHash}",
        "${contributor}",
        "${username}",
        ${value.toNumber()},
        ${reservedValue.toNumber()},
        ${date.toNumber()},
        "${rewardType}",
        "${organization}"
      );
    `, (error, result) => {
      if (error) { console.log(error) }
      resolve(result)
    })
  })
}
