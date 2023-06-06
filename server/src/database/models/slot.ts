import * as mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({
  name: String,
  surname: String,
  email: String
})

const slotSchema = new mongoose.Schema({
  date: Date,
  candidate: candidateSchema,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  created_at: { type: Date, default: Date.now() }
});

export const Slot = mongoose.model("Slot", slotSchema);

