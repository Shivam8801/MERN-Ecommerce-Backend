import express from "express";
import mongoose from "mongoose";
const server = express();
import productRouters from "./routes/Products.js";
import brandRouters from "./routes/Brands.js";
import categoryRouters from "./routes/Categories.js";
import userRouters from "./routes/User.js";
import authRouters from "./routes/Auth.js";
import cartRouters from "./routes/Cart.js";
import ordersRouters from "./routes/Order.js";
import User from "./model/User.js";
import { Strategy as LocalStrategy } from "passport-local";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import { isAuth, sanitizeUser, cookieExtractor } from "./services/common.js";
import crypto from "crypto";
import { ExtractJwt } from "passport-jwt";
import { Strategy as JwtStrategy } from "passport-jwt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import Stripe from "stripe";

const SECRET_KEY = "secret";

// JWT Options

var opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = SECRET_KEY;

// middlewares
server.use(express.static("build"));

server.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

server.use(cookieParser());

server.use(passport.authenticate("session"));

server.use(cors({ exposedHeaders: ["X-Total-Count"] }));

server.use(express.raw({ type: "application/json" }));
server.use(express.json()); // to parse req.body
server.use("/products", isAuth(), productRouters);
server.use("/brands", isAuth(), brandRouters);
server.use("/categories", isAuth(), categoryRouters);
server.use("/users", isAuth(), userRouters);
server.use("/auth", authRouters);
server.use("/cart", isAuth(), cartRouters);
server.use("/orders", isAuth(), ordersRouters);

passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    try {
      const user = await User.findOne({ email: email }).exec();

      if (!user) {
        done(null, false, { message: "invalid credentials" });
      }

      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: "invalid credentials" });
          }
          const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
          done(null, { id: user.id, role: user.role, token }); // this lines sends to serializer
        }
      );
    } catch (err) {
      done(err);
    }
  })
);

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log({ jwt_payload });

    try {
      const user = await User.findById(jwt_payload.id);

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

passport.serializeUser(function (user, cb) {
  console.log(user);
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

passport.deserializeUser(function (user, cb) {
  console.log(user);
  process.nextTick(function () {
    return cb(null, user);
  });
});

// payments

// This is your test secret API key.
const stripe = Stripe(
  "sk_test_51NNx54SARInVfeCtmRWGaIFFSRUrVrfbkr9ZqUS2fxJrTjcxS3zmpMBkKgPAA6yOLzbknikDb8ri6PdJ1fSgYUp000nYSRTbct"
);

server.post("/create-payment-intent", async (req, res) => {
  const { totalAmount } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100, // for decimal calc
    currency: "inr",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

// web hooks

server.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
  console.log("Database Connected!");
}

server.get("/", (req, res) => {
  res.json({ status: "Success" });
});

server.listen(8080, () => {
  console.log("server started!");
});
