import { config } from "../config";

export const connect = async function (mongoose: any) {
  try {
    await mongoose.connect(config.mongoConnection, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connection to MongoDB successful!");
  } catch(err) {
    console.log('Error trying to connect to MongoDB.', err);
  }
}