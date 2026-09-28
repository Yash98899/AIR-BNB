const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema= new Schema({
    title: {
        type:String,
        required: true,
    },
    description: String,
    image: {
    filename: {
        type: String,
        default: "listingimage"
    },
    url: {
        type: String,
        default: "https://images.unsplash.com/photo-1787486433112-2ac2bc9f2983?q=80&w=1706&auto=format&fit=crop"
    }
},
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports= Listing;


// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const listingSchema = new Schema({
//     title: {
//         type: String,
//         required: true,
//     },

//     description: String,

//     image: {
//         filename: {
//             type: String,
//             default: "listingimage"
//         },
//         url: {
//             type: String,
//             default: "https://images.unsplash.com/photo-1787486433112-2ac2bc9f2983?q=80&w=1706&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//         }
//     },

//     price: Number,
//     location: String,
//     country: String,
// });

// const Listing = mongoose.model("Listing", listingSchema);

// module.exports = Listing;