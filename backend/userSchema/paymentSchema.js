// import mongoose from "mongoose";

// const paymentSchema = new mongoose.Schema({
//     userId:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"User",
//         required:true
//     },
//     amount:{
//         type:Number,
//         required:true
//     },
//     transactionId:{
//         type:String,
//         required:true,
//         unique:true
//     },
//     paymentProf:{
//         type:String,
//         required:false
//     },
//     status:{
//         type:String,
//         enum:["pending", "approved", "rejected"],
//         default:"pending"
//     }
// },{timestamps:true})

// const Pay = mongoose.model("Pay",paymentSchema)
// export default Pay