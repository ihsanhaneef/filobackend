// // adminenq.js
// import mongoose from 'mongoose';

// const Schema = mongoose.Schema;

// const workSchema = new Schema({
//     workName: String,
//     department: String,
// });

// const clientSchema = new Schema({
//     clientName: String,
// });

// const Work = mongoose.model('Work', workSchema);
// const Client = mongoose.model('Client', clientSchema);

// export { Work, Client };


// adminenq.js
// adminenq.js
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const workSchema = new Schema({
    workName: String,
    department: String,
});

const clientSchema = new Schema({
    clientName: String,
});

const Work = mongoose.model('Work', workSchema);
const Client = mongoose.model('Client', clientSchema);

export { Work, Client };
