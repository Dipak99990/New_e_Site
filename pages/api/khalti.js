import axios from "axios";

export async function handler(req, res) {
  try {
    console.log("this is api");
    const payload = req.body;
    const data = {
      token: payload.token,
      amount: payload.amount,
    };
    let config = {
      headers: {
        Authorization: test_secret_key_729c0ce7e6e54f82aec56cb828afff8a0,
      },
    };

    const response = await axios.post(
      "https://khalti.com/api/v2/payment/verify/",
      data,
      config
    );
    console.log("response", response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong!");
  }
}
