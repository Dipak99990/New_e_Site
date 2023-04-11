import mongoose from "mongoose";

const KhaltiSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  purchase_order_id: { type: String, reuired: true },
  purchase_order_name: [
    {
      name: { type: String, required: true },
    },
  ],
  pidx: { type: String, required: true },
});
const Khalti = mongoose.models.Khalti || mongoose.model("Khalti", KhaltiSchema);
export default Khalti;
