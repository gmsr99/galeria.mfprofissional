const cloudinary = require("cloudinary");
const dotenv = require("dotenv");
const env = dotenv.config({path: ".env.local"}).parsed;
cloudinary.v2.config({
  cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET
});
cloudinary.v2.uploader.create_zip({ public_ids: ["1._Photocall100_vcgtwf", "1._Photocall101_ll62bo"] })
  .then(res => console.log(res.secure_url))
  .catch(err => console.error(err));
