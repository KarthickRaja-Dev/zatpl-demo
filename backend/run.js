const bcrypt = require("bcryptjs");
const hashPass = async () => {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash("zatpl2025", salt);
  console.log(password);
  const isMatch = await bcrypt.compare(
    "zatpl2025",
    "$2b$10$7EeXjZNqXmQmw/i5cgpiOOFlC30gLIxQNGfzo7pyAOqn8E/zGQ5Ha"
  );
  console.log("Password Matched : ", isMatch)
};
hashPass()