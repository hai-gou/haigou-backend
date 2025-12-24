module.exports = {
  insert (collectionName, insertData) {
    // 采用 es6的promise 解决异步操作问题
    // https://es6.ruanyifeng.com/#docs/promise
    return new Promise((resolve, reject) => {
      collectionName.insertMany(insertData, err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  },
  delete (collectionName, whereData, deleteNum) {
    const deleteType = deleteNum === 1 ? 'deleteMany' : 'deleteOne'
    return new Promise((resolve, reject) => {
      collectionName[deleteType](whereData, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    }) 
  },
  update (collectionName, whereData, updateData, updateNum) {
    // updateOne
    // updateMany
    const updateType = updateNum === 1 ? 'updateMany' : 'updateOne'
    return new Promise((resolve, reject) => {
      collectionName[updateType](whereData, updateData, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  },
  find (collectionName, whereData, showData) {
    return new Promise((resolve, reject) => {
      // collectionName.find(whereData, showData, (err, data) => {
      //   if (err) {
      //      reject(err)
      //   } else {
      //     resolve(data)
      //   }
      // })
      collectionName.find(whereData, showData).exec((err, data) => {
        if (err) {
           reject(err)
        } else {
          resolve(data)
        }
      })
    })
  },
  paging (collectionName, whereData, showData, count, limitNum) {
    return new Promise((resolve, reject) => {
      collectionName.find(whereData, showData)
      .limit(limitNum)
      .skip((count - 1) * limitNum)
      .exec((err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  },
  sort (collectionName, whereData, showData, sortData) {
    return new Promise((resolve, reject) => {
      // Search.find({}, { _id:0, __v: 0}).sort({num: -1})
      collectionName.find(whereData, showData).sort(sortData).exec((err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  },
  distinct(collectionName, type) {
    return new Promise((resolve, reject) => {
      collectionName.distinct(type).exec((err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  },
  count (CollectionName, whereData) {
    whereData = whereData || {}
    return new Promise(resolve => {
      // count() 在某些 版本 不可用
      // countDocuments() ok
      // estimatedDocumentCount() ok
      CollectionName.find(whereData).estimatedDocumentCount((err, len) => {
        if (err) throw err
        resolve(len)
      })
    })
  },
}