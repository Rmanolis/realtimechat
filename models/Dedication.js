/**
 * Created by manos on 11/19/13.
 */
module.exports = function () {
    var mongoose = require('../settings').mongoose;

    var DedicationSchema = new mongoose.Schema({
        message: String,
        nickname: String,
        isAccepted: Boolean,
        date: Date
    });

    var Dedication = mongoose.model('Dedication', DedicationSchema);

    var addDedication = function (message, nickname) {
        var dedication = Dedication({
            message: message,
            nickname: nickname,
            isAccepted: false,
            date: new Date()
        });

        dedication.save(function () {
            console.log('Dedication saved');
        });
        return dedication;
    };

    var acceptDedication = function (id, callback) {
        Dedication.findOne({_id: id}, function (err, data) {
            if (data) {
                data.isAccepted = true;
                data.save(function () {
                    console.log('Updated id ' + id);
                });
                callback(data);
            }
        });
    };

    var removeDedication = function (id) {
        Dedication.findOne({_id: id}, function (err, data) {
            if (err) {
                console.log("Dedication remove error with id : " + id + ' ' + err);
            } else {
                if (data !== null) {
                    data.remove(function (err) {
                        if (err) {
                            console.log('Dedication did not remove ' + id)
                        }
                    });
                } else {
                    console.log('Dedication does not exist');
                }
            }
        });
    };

    var removeAllDedications = function () {
        Dedication.remove({}, function (err) {
            console.log('Dedications removed');
        });
    }

    return {
        addDedication: addDedication,
        removeDedication: removeDedication,
        acceptDedication: acceptDedication,
        removeAllDedications: removeAllDedications,
        model: Dedication


    }
}