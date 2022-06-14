const mongoose = require("mongoose");
const { getMaxListeners } = require("./models/Buyer");
const Buyer = require("./models/Buyer");
const Cart = require("./models/Cart");
const CartItem = require("./models/CartItem");
const CollectionName = require("./models/CollectionName");
const Order = require("./models/Order");
const Product = require("./models/Product");
const ProductType = require("./models/ProductType");
const Seller = require("./models/Seller");
const Admin = require("./models/Admin");
const bcrypt = require("bcryptjs");

mongoose.connect("mongodb://localhost/webshopdb");

runScript();

async function runScript() {
  /*
  ------------------------------------------Buyer
  const buyer = await Buyer.create({
    email: "nikola1@gmail.com",
    password: "nikola1",
    name: "Nikola",
    lastName: "Bikar",
    dateOfBirth: "1999-05-15",
  });
  const buyer2 = await Buyer.create({
    email: "markom@gmail.com",
    password: "csca1",
    name: "Marko",
    lastName: "Markovic",
    dateOfBirth: "1999-05-22",
  });
  await console.log(buyer); 625d17d7d97ddbe1ce80d081
  await console.log(buyer2); 625d17d7d97ddbe1ce80d084
  */
  /*
  ------------------------------------------Cart
  const cart = await Cart.create({
    buyer: mongoose.Types.ObjectId("625d17d7d97ddbe1ce80d081"),
  });
  const cart2 = await Cart.create({
    buyer: mongoose.Types.ObjectId("625d17d7d97ddbe1ce80d084"),
  });
  625d1d50938a5ba8155f32e4
  625d1d50938a5ba8155f32e7
  */
  /*
  ------------------------------------------Seller
  const seller = await Seller.create({
    email: "seller@gmail.com",
    password: "sell",
    brandName: "Prvi u gradu",
    brandDescription: "Prvi u gradu su nastali 2003. godine, prvi smo.",
  });
  const seller2 = await Seller.create({
    email: "seller2@gmail.com",
    password: "sell",
    brandName: "Braca burazeri",
    brandDescription: "Braca burazeri",
  });
  await console.log(seller);625d1df5db7e24b7db41b0e7
  await console.log(seller2);625d1df5db7e24b7db41b0ea
  */
  /*
  ------------------------------------------Collection name
  const collectionName = await CollectionName.create({
    seller: mongoose.Types.ObjectId("625d1df5db7e24b7db41b0e7"),
    name: "Leto 2022",
    description: "Najsvezije ovog leta",
    created: "2022-04-12",
  });
  const collectionName2 = await CollectionName.create({
    seller: mongoose.Types.ObjectId("625d1df5db7e24b7db41b0ea"),
    name: "Prolece 2022",
    description: "Kolekcija za prolece 2022, inspirisana prolecem.",
    created: "2022-04-18",
  });
  await console.log(collectionName); 625d2092c56c6c53da6d6559
  await console.log(collectionName2); 625d2092c56c6c53da6d655c
  */
  /*
  try {
    const collectionName = await CollectionName.where("name")
      .equals("Leto 2022")
      .populate("seller");
    console.log(collectionName);
  } catch (e) {
    console.log(e.message);
  }
  */
  /*
  ------------------------------------------Product type
  const productType = await ProductType.create({
    type: "majica",
  });
  const productType2 = await ProductType.create({
    type: "sorc",
  });
  await console.log(productType); 625d292d8aa33e885f204d39
  await console.log(productType2); 625d292d8aa33e885f204d3c
  */
  /*
 ------------------------------------------Product
  const product = await Product.create({
    collectionName: mongoose.Types.ObjectId("625d2092c56c6c53da6d6559"),
    productType: mongoose.Types.ObjectId("625d292d8aa33e885f204d39"),
    name: "Majica print",
    gender: "muska",
    price: "2000",
  });
   */
  /*const product2 = await Product.create({
    collectionName: mongoose.Types.ObjectId("627f85b45a44e4fa4f5297ae"),
    name: "Crveni",
    gender: "muska",
    price: "2300",
  });*/
  /*
  ------------------------------------------Product amount
  const productAmount = await ProductAmount.create({
    product: mongoose.Types.ObjectId("625d2ab3127b3350d7208ee3"),
    xs: 0,
    s: 10,
    m: 15,
    l: 10,
    xl: 5,
    xxl: 3,
    xxxl: 1,
    xxxxl: 0,
  });
  const productAmount2 = await ProductAmount.create({
    product: mongoose.Types.ObjectId("625d2ab3127b3350d7208ee6"),
    xs: 0,
    s: 10,
    m: 15,
    l: 10,
    xl: 5,
    xxl: 3,
    xxxl: 1,
    xxxxl: 0,
  });
  await console.log(productAmount); 625d2b6d5aade5e00d041ccc
  await console.log(productAmount2); 25d2b6d5aade5e00d041ccf
  */
  /*
  ------------------------------------------Cart item
  const cartItem = await CartItem.create({
    cartId: mongoose.Types.ObjectId("625d1d50938a5ba8155f32e4"),
    product: mongoose.Types.ObjectId("625d2ab3127b3350d7208ee3"),
    amount: 1,
    size: "S",
  });
  const cartItem2 = await CartItem.create({
    cartId: mongoose.Types.ObjectId("625d1d50938a5ba8155f32e4"),
    product: mongoose.Types.ObjectId("625d2ab3127b3350d7208ee6"),
    amount: 2,
    size: "L",
  });
  await console.log(cartItem); 625d2e29767111c3482c0a54
  await console.log(cartItem2); 625d2e29767111c3482c0a57
  */
  /*
  ------------------------------------------Order
  const order = await Order.create({
    status: "Dostavljeno",
    phoneNumber: "+381652211041",
    streetName: "Kosovska",
    number: 1,
    postalCode: 21000,
    country: "Serbia",
    cart: mongoose.Types.ObjectId("625d1d50938a5ba8155f32e4"),
  });
  
  const order2 = await Order.create({
    status: "Dostavljeno",
    phoneNumber: "+381652211041",
    streetName: "Kosovska",
    number: 1,
    postalCode: 21000,
    country: "Serbia",
    cart: mongoose.Types.ObjectId("625d1d50938a5ba8155f32e7"),
  });
  await console.log(order);
  await console.log(order2);
  */
  /* const admin = await Admin.create({
    email: "bikar@bikar",
    password: "bikar",
  });*/

  let password = "nikola";
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }

  const createdAdmin = await Admin.create({
    email: "nikola@gmail.com",
    password: hashedPassword,
    name: "Nikola",
    lastName: "Bikar",
    role: "Admin",
  });

  const createdProductType = await ProductType.create({
    type: "majica",
  });

  const createdProductType2 = await ProductType.create({
    type: "sorc",
  });

  const createdProductType3 = await ProductType.create({
    type: "kosulja",
  });

  await console.log(createdProductType);

  await console.log(createdProductType2);
  await console.log(createdProductType3);

  await console.log(createdAdmin);
}
