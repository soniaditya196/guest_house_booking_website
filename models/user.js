const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema=new Schema(
    {
        username:{
            type:String,
            required:true,
            minlength:1,
            trim:true,

        },
        email:{
            type:String,
            required:true,
            trim:true,
            minlength:1,
            unique:true,
           
        },
        password:{
            type:String,
            required:true,
            minlength:6
        },
        phoneNumber:{
            type:String,
            trim:true
        },
        arrivalDate:{
            type:Schema.Types.Mixed
        },
        departureDate:{
            type:Schema.Types.Mixed
        },
        numberOfGuests:{
            type:Number,
            default:1
        },
        secretToken:String,
        active:Boolean,
        role:{
            type:String,
            default:"guest"
        },
        profileComplete:{
            type:Boolean,
            default:false
        }
        
    },
    {
        timestamps: {
          createdAt: "createdAt",
          updatedAt: "updatedAt"
        }
    }

);

const User = mongoose.model('User', userSchema);

module.exports = User;

module.exports.hashPassword = async (password) => {
	try {
		const salt = await bcrypt.genSalt(10);
		return await bcrypt.hash(password, salt);
	} catch (error) {
		throw new Error('Hashing failed', error);
	}
};

module.exports.comparePasswords = async (inputPassword, hashedPassword) => {
	try {
		return await bcrypt.compare(inputPassword, hashedPassword);
	} catch (error) {
		throw new Error('Comparing failed', error);
	}
};