const dbconection = require('./mongoConnection')

const getCollectionInfo = (collection) => {
    let _col = undefined
    return async () => {
        if (!_col) {
            const db = await dbconection.connectToDb()
            _col = await db.collection(collection)
        }
        return _col
    }
}

module.exports = {
    users: getCollectionInfo("users"),
    bookings: getCollectionInfo("bookings"),
    questions : getCollectionInfo("questions")
};