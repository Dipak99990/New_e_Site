import Order from "@/models/Order";
import db from "@/utils/db";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  try {
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).send("sign in required");
    }
    await db.connect();
    const order = await Order.findById(req.query.orderId);
    if (order) {
      if (order.isPaid) {
        return res.status(400).send({ message: "Order Already Paid" });
      } else {
        order.isPaid = true;
        order.paidAt = Date.now();
      }
      const paidOrder = await order.save();
      await db.disconnect();
      return res
        .status(201)
        .send({ message: "Order Paid Successfully", order: paidOrder });
    } else {
      await db.disconnect();
      return res.status(400).send({ message: "error not found" });
    }
  } catch (error) {
    console.error(error);
    await db.disconnect();
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

export default handler;
