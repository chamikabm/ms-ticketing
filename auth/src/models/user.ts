import mongoose from 'mongoose';
import { Password } from '../services/password';

// An interface that describes the properties
// that are required to creat a new User.
interface UserAttrs {
    email: string,
    password: string,
}

// An interface that describes the properties
// that a User Model has.
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc,
}

// An interface that describes the properties
// that a User Document has.
interface UserDoc extends mongoose.Document {
    email: string,
    password: string,
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});


userSchema.pre('save', async function(done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }

    // After we are done with all the async work, we need to manually call this done()
    // method, as the mongoose does not fully support async await featured in JS.
    done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

// const User = mongoose.model('User', userSchema);
// New need to add '<any, UserModel>' to bind typescript model to mongoose model.
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

// We create this builder function to get help with typescript when creating
// users, otherwise mongoose User model does not have type validations. Having such
// builder allow us to validate the User attributes through the UserAttrs interface
// when passing to the `buildUser` function.
// const buildUser = (attrs: UserAttrs) => {
//     return new User(attrs);
// };

// export { User, buildUser };

// Without doing above, we can export Single `User` model as we normally do
// by using 'userSchema.statics.build' to attach a function to create users
// as above, so that we can simply create users as below.

// User.build({
//     email: '',
//     password: ''
// })



export { User };
