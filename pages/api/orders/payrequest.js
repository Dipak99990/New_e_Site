import Order from "@/models/Order";
import db from "@/utils/db";

export default async function (req, res) {
  try {
    await db.connect();
    const orderId = req.query.orderId; // get orderId from req.query
    const order = await Order.findOneAndUpdate(
      { _id: orderId },
      { isPaid: true },
      { new: true } // to return the updated document
    );
    db.disconnect();
    res.status(201).json(order);
  } catch (error) {
    console.log(error);
  }
}
