import Promise from 'bluebird'

/**
 * [broadcastEvent description]
 * @param  {[type]} details [description]
 * @return [type]           [description]
 */
export default function broadcastEvent(details) {
  return new Promise((resolve, reject) => {
    Promise.resolve(Object.keys(this.connections)).map((id) => {
      if (!this.connections[id].destroyed) {
        this.connections[id].write(JSON.stringify(details))
      } else {
        delete this.connections[id]
      }

      return null;
    }).then(() => {
      resolve(true)
    }).catch((error) => {
      reject(error)
    })
  })
}
