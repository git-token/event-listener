import Promise from 'bluebird'

/**
 * [handleEvent description]
 * @param  {[type]} data        [description]
 * @param  {[type]} organization [description]
 * @return [type]               [description]
 */
export default function handleEvent({ data, organization }) {
  return new Promise((resolve, reject) => {
    const { event, args, transactionHash } = data
    switch(event) {
      case 'Contribution':
        resolve(this.insertIntoContributions({
          ...args,
          transactionHash,
          organization
        }))
        break;
      default:
      resolve(data)
    }
  })
}
