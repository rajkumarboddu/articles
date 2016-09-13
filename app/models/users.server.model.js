var mongoose = require('mongoose'),
    crypto = require('crypto'),
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
        match: [/.+\@.+\..+/, 'Invalid email address']
    },
    username: {
        type: String,
        unique: true,
        trim: true,
        required: 'Username is required'
    },
    password: {
        type: String,
        required: 'Password is required',
        validate: [
            function(password){
                return password && password.length > 6
            },
            'Password should be longer'
        ]
    },
    salt: {
        type: String
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

UserSchema.pre('save', function(next){
    if(this.password){
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }
    next();
});

UserSchema.methods.hashPassword = function(password){
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
};

UserSchema.methods.authenticate = function(password){
    return this.password = this.hashPassword(password);
};

UserSchema.statics.findUniqueUsername = function(username, suffix, callback){
    var _this = this;
    var possibleUsername = username + (suffix || '');
    _this.findOne({
        username: possibleUsername
    }, function(err, user) {
        if (!err) {
            if (!user) {
                callback(possibleUsername);
            } else {
                return _this.findUniqueUsername(username, (suffix || 0) +
                1, callback);
            }
        } else {
            callback(null);
        }
    });
};

UserSchema.set('toJSON',{getters: true, virtuals: true});

mongoose.model('User',UserSchema);