import Order from "@/models/Order";
import db from "@/utils/db";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  const session = getSession({ req });
  if (!session) {
    return res.status(401).send("sign in required");
  }
  await db.connect();
  const order = await Order.findById(req.query.orderId);
  await db.disconnect();
  res.send(order);
};
export default handler;
