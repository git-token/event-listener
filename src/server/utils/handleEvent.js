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
    try {
      switch(event) {
        case 'Contribution':
          this.insertIntoContributions({
            ...args,
            transactionHash,
            organization
          })
          .then((result) => { resolve({ event, data: result }) })
          .catch((error) => { reject(error) })
          break;
        default:
        resolve(data)
      }
    } catch (error) {
      reject(error)
    }
  })
}
