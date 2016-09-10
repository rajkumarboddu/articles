var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    firstName: {
        type: String,
        required: 'First name is required'
    },
    lastName: {
        type: String,
        required: 'Last name is required'
    },
    email: {
        type: String,
        unique: true,
        required: 'Email is required',
        match: [/^.+@.+\..+$/, 'Invalid email address']
    },
    username: {
        type: String,
        unique: true,
        trim: true,
        required: 'Username is required'
    },
    password: {
        type: String,
        required: 'Password is required'
    },
    created: {
        type: Date,
        default: Date.now
    }
});

UserSchema.virtual('fullName').get(function(){
    return this.firstName + ' ' + this.lastName;
}).set(function(fullName){
    var splitName = fullName.split(' ');
    this.firstName = splitName[0] || '';
    this.lastName = splitName[1] || '';
});

UserSchema.set('toJSON',{getters: true, virtuals: true});

mongoose.model('User',UserSchema);