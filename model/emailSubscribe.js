import mongoose from "mongoose";

const subscribeEmail = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
});

const emailModel = mongoose.model("EmailSubscribe", subscribeEmail);
export default emailModel;
