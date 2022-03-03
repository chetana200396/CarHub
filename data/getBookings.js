const mongoCollections = require('../config/mongoCollections');
const bookings = mongoCollections.bookings;
let { ObjectId } = require('mongodb');
const app = require('../app');
const searchData = require('./searchCar')
const users = mongoCollections.users;
const email = require('../data/sendEmail')

const newBooking = async(fromDate, toDate, carId, myId) => {

    if (fromDate && toDate) {
        let startdata = fromDate.split('-');
        let endd = toDate.split('-');
        let std = (new Date(parseInt(startdata[0]), parseInt(startdata[1]) - 1, parseInt(startdata[2]))).getTime()
        let end = (new Date(parseInt(endd[0]), parseInt(endd[1]) - 1, parseInt(endd[2]))).getTime()
        let currDate = (new Date()).getTime();
        if (end < std) {
            throw `End date cannot be less than start date!`;
        } else if (std < currDate && currDate - std > 86400000) {
            throw `start date cannot be less than current date!`;
        }
    } else if (fromDate || toDate) {
        throw `Provide Both start and end dates`
    }

    if (!myId) {
        throw `Please login`;
    } else if (!carId) {
        throw `Please Select A Car`;
    }

    if (!ObjectId.isValid(myId)) {
        throw `Please login`;
    } else if (!ObjectId.isValid(carId)) {
        throw `Please Select A Car`;
    }

    const startdata_array = fromDate.split('-');
    const enddate_array = toDate.split('-');
    const startdate = (new Date(parseInt(startdata_array[0]), parseInt(startdata_array[1]) - 1, parseInt(startdata_array[2]))).getTime()
    const enddate = (new Date(parseInt(enddate_array[0]), parseInt(enddate_array[1]) - 1, parseInt(enddate_array[2]))).getTime()
    const ownerId = await app.map.get(carId)
    const data = await searchData.getCar_Person(ownerId, carId)
    const bookingCollection = await bookings();
    let set = await approvedBookings(carId, startdate, enddate)
    if (set.size > 0) {
        throw data[0].address.city
    }
    const newBook = {

        userId: ObjectId(myId),
        bookingStatus: "PENDING",
        car: {
            _id: ObjectId(carId),
            brandName: data[0].cars[0].brandName,
            color: data[0].cars[0].color,
            number: data[0].cars[0].number,
            capacity: data[0].cars[0].capacity,
            status: data[0].cars[0].status,
            rate: data[0].cars[0].rate,
            startdate,
            enddate
        },
        ownerId: ObjectId(ownerId),
        totalCost: enddate === startdate ? parseInt(data[0].cars[0].rate) : ((enddate - startdate) / (1000 * 3600 * 24)) * data[0].cars[0].rate,
        creationDate: (new Date()).getTime()
    }
    const insertInfo = await bookingCollection.insertOne(newBook)
    if (insertInfo.insertedCount === 0) throw 'Could not add booking';

    //send mail to car owner
    let carBorrowerEmailAddress = null;
    const collection = await users();
    const res = await collection.findOne({ "_id": ObjectId(myId) });
    if (!res) {
        throw `Invalid Booking`;
    } else {
        carBorrowerEmailAddress = res.email;
    }

    let carOwnerEmailAddress = null;
    const res1 = await collection.findOne({ "_id": ObjectId(ownerId) });
    if (!res1) {
        throw `Invalid Booking`;
    } else {
        carOwnerEmailAddress = res1.email;
    }
    let subject = 'Car Booking Request';
    let html = `${res.firstName} , User requested for your car from ${fromDate} to ${toDate}`;
    await email.sendEmail(carBorrowerEmailAddress, carOwnerEmailAddress, subject, html);

    return insertInfo
}
const pendingByCarId = async(carId, ownerId) => {
    if (typeof(carId) == 'undefined') {
        throw 'carId parameter must be passed'
    }

    if (typeof(carId) != 'string') {
        throw 'Incorrect data type of carId parameter';
    }
    if (!carId.replace(/\s/g, '').length) {
        throw 'carId contains only spaces';
    }
    if (typeof(ownerId) == 'undefined') {
        throw 'ownerId parameter must be passed'
    }
    if (typeof(ownerId) != 'string') {
        throw 'Incorrect data type of ownerId parameter';
    }
    if (!ownerId.replace(/\s/g, '').length) {
        throw 'ownerId contains only spaces';
    }
    let parsedId = ObjectId(carId);
    let parsedId2 = ObjectId(ownerId);
    const bookingCollection = await bookings();
    const req1 = await bookingCollection.find({ "car._id": parsedId, "bookingStatus": "PENDING", ownerId: parsedId2 }).toArray();
    await req1.map((booking) => {
        booking.car.startdate = (new Date(booking.car.startdate)).toDateString()
        booking.car.enddate = (new Date(booking.car.enddate)).toDateString()
    })
    return req1;
}
const updateById = async(bookingId) => {

    let parsedId = ObjectId(bookingId);
    const bookingCollection = await bookings();
    var book1 = await bookingCollection.findOne({ "_id": parsedId });
    if (!book1) {
        throw `Invalid Booking`;
    }

    let carBorrowerEmailAddress = null;
    const collection = await users();
    const res = await collection.findOne({ "_id": book1.userId });
    if (!res) {
        throw `Invalid Booking`;
    } else {
        carBorrowerEmailAddress = res.email;
    }

    let carOwnerEmailAddress = null;
    const res1 = await collection.findOne({ "_id": book1.ownerId });
    if (!res1) {
        throw `Invalid Booking`;
    } else {
        carOwnerEmailAddress = res1.email;
    }

    if (typeof(bookingId) == 'undefined') {
        throw 'bookingId parameter must be passed'
    }
    if (typeof(bookingId) != 'string') {
        throw 'Incorrect data type of bookingId parameter';
    }
    if (!bookingId.replace(/\s/g, '').length) {
        throw 'bookingId contains only spaces';
    }
    // let parsedId = ObjectId(bookingId);
    // const bookingCollection = await bookings();
    var bookObj = await bookingCollection.updateOne({ _id: parsedId }, {
        $set: { bookingStatus: "APPROVED" }
    })

    if (bookObj["modifiedCount"] == 1) {
        let subject = 'Car Booking  : Approved';
        let html = `Your Car booking request has been Approved`;
        await email.sendEmail(carOwnerEmailAddress, carBorrowerEmailAddress, subject, html);
    } else {
        throw "Error while updating";
    }
    if (bookObj["modifiedCount"] == 1) {
        return true;
    }
}
const getById = async(bookingId) => {
    if (typeof(bookingId) == 'undefined') {
        throw 'bookingId parameter must be passed'
    }
    if (typeof(bookingId) != 'string') {
        throw 'Incorrect data type of bookingId parameter';
    }
    if (!bookingId.replace(/\s/g, '').length) {
        throw 'bookingId contains only spaces';
    }
    let parsedId = ObjectId(bookingId);
    const bookingCollection = await bookings();
    var book1 = await bookingCollection.findOne({ "_id": parsedId });
    return book1;
}

const approvedBookings = async(carId, startdate, enddate) => {
    const bookingCollection = await bookings();
    const cars = await bookingCollection.aggregate([{
        $match: {
            "bookingStatus": "APPROVED",
            "car._id": ObjectId(carId),
        }
    }, {
        $project: {
            "car._id": 1,
            "car.startdate": 1,
            "car.enddate": 1
        }
    }]).toArray();

    let approvedBooking = new Set()

    cars.map((car) => {
        if (startdate > car.car.startdate && enddate < car.car.enddate) {
            approvedBooking.add(car.car._id.toString())
        } else if (startdate <= car.car.startdate && enddate > car.car.startdate) {
            approvedBooking.add(car.car._id.toString())
        } else if (startdate <= car.car.enddate && enddate > car.car.enddate) {
            approvedBooking.add(car.car._id.toString())
        }
    })
    return approvedBooking

}



const getpendingByCarId = async(carId) => {
    if (typeof(carId) == 'undefined') {
        throw 'carId parameter must be passed'
    }

    if (typeof(carId) != 'string') {
        throw 'Incorrect data type of carId parameter';
    }
    if (!carId.replace(/\s/g, '').length) {
        throw 'carId contains only spaces';
    }
    let parsedId = ObjectId(carId);
    const bookingCollection = await bookings();
    const book = await bookingCollection.find({ "car._id": parsedId, "bookingStatus": "PENDING" }).toArray();
    return book;
}
const updateRejectedById = async(bookingId) => {
    let parsedId = ObjectId(bookingId);
    const bookingCollection = await bookings();
    var book1 = await bookingCollection.findOne({ "_id": parsedId });
    if (!book1) {
        throw `Invalid Booking`;
    }

    let carBorrowerEmailAddress = null;
    const collection = await users();
    const res = await collection.findOne({ "_id": book1.userId });
    if (!res) {
        throw `Invalid Booking`;
    } else {
        carBorrowerEmailAddress = res.email;
    }

    let carOwnerEmailAddress = null;
    const res1 = await collection.findOne({ "_id": book1.ownerId });
    if (!res1) {
        throw `Invalid Booking`;
    } else {
        carOwnerEmailAddress = res1.email;
    }

    if (typeof(bookingId) == 'undefined') {
        throw 'bookingId parameter must be passed'
    }
    // const bookingCollection = await bookings();
    let bookObj1 = await bookingCollection.updateOne({ _id: bookingId }, {
        $set: { bookingStatus: "REJECTED" }
    })
    if (bookObj1["modifiedCount"] == 1) {
        let subject = 'Car Booking Status : Rejected';
        let html = `Your Car booking request has been Rejected`;
        await email.sendEmail(carOwnerEmailAddress, carBorrowerEmailAddress, subject, html);
    } else {
        throw "Error while updating";
    }
    if (bookObj1["modifiedCount"] == 1) {
        return true
    }
}
const deletePending = async(carId) => {
    if (typeof(carId) == 'undefined') {
        throw 'carId parameter must be passed'
    }

    if (typeof(carId) != 'string') {
        throw 'Incorrect data type of carId parameter';
    }
    if (!carId.replace(/\s/g, '').length) {
        throw 'carId contains only spaces';
    }
    let parsedId1 = ObjectId(carId)
    const bookingCollection = await bookings();
    var a = await bookingCollection.deleteMany({ "car._id": parsedId1, bookingStatus: "PENDING" })
}
const getAllByUserId = async(userId) => {
    if (typeof(userId) == 'undefined') {
        throw 'userId parameter must be passed'
    }

    if (typeof(userId) != 'string') {
        throw 'Incorrect data type of userId parameter';
    }
    if (!userId.replace(/\s/g, '').length) {
        throw 'userId contains only spaces';
    }
    let parsedId = ObjectId(userId)
    const bookingCollection = await bookings();
    const booking1 = await bookingCollection.find({ userId: parsedId }).toArray();
    await booking1.map((booking) => {
        booking.car.startdate = (new Date(booking.car.startdate)).toDateString()
        booking.car.enddate = (new Date(booking.car.enddate)).toDateString()
    })
    return booking1;
}


module.exports = {
    newBooking,
    pendingByCarId,
    updateById,
    getById,
    getpendingByCarId,
    updateRejectedById,
    deletePending,
    getAllByUserId
}