import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderItems: [
      {
        slug: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        name: { type: String, required: true },

        image: { type: String, required: true },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },

      district: { type: String, required: true },
      city: { type: String, required: true },

      ward: { type: Number, required: true },
      postalcode: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    Amt: { type: Number },
    txAmt: { type: Number, required: true },
    psc: { type: Number },
    totalAmt: { type: Number, required: true },
    isDelivered: { type: Boolean, required: true, default: false },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
export default Order;
