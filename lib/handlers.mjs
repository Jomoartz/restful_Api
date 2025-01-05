// These are the request handlers
import { data as __data } from "./data.mjs";
import { helpers } from "./helpers.mjs";

export const handler = {};
handler.sample = async (data) => [200, { name: data }];
handler.foo = async () => [404, { Alert: "page is under development" }];
handler.notFound = async () => [404];
handler.ping = async () => [200];
handler.users = async (data) => {
  const acceptedMethods = ["post", "get", "put", "delete"];
  if (acceptedMethods.includes(data.method) && data.method == "post") {
    return await handler._users.post(data);
  } else if (data.method == "get") {
    return await handler._users.get(data);
  } else {
    return [405];
  }
};

handler._users = {};

handler._users.post = async (data) => {
  try {
    // Declare and validate data
    const firstName =
      typeof data.payload.firstName === "string" &&
      data.payload.firstName.trim().length > 0
        ? data.payload.firstName.trim()
        : false;
    const lastName =
      typeof data.payload.lastName === "string" &&
      data.payload.lastName.trim().length > 0
        ? data.payload.lastName.trim()
        : false;
    const phone =
      typeof data.payload.phone === "string" &&
      data.payload.phone.trim().length > 9
        ? data.payload.phone.trim()
        : false;
    const password =
      typeof data.payload.password === "string" &&
      data.payload.password.trim().length > 3
        ? data.payload.password.trim()
        : false;
    const tosAgreement =
      typeof data.payload.tosAgreement === "boolean" &&
      data.payload.tosAgreement === true
        ? data.payload.tosAgreement
        : false;

    if (firstName && lastName && phone && password && tosAgreement) {
      // Check if phone number exists already
      try {
        await __data.read("users", phone);
      } catch (error) {
        if (error) {
          // Hash the password
          const encryptedPassword = helpers.hash(password);

          if (encryptedPassword) {
            console.log("UP TO HERE WORKS FINE");
            const userObject = {
              firstName: firstName,
              lastName: lastName,
              phone: phone,
              hashedPassword: encryptedPassword,
              tosAgreement: true,
            };
            try {
              await __data.create("users", phone, userObject);
              console.log("Data created successfully!");
              return [200, { success: "User created successfully" }];
            } catch (error) {
              return [500, { error: `User data not stored: ${error.message}` }];
            }
          } else {
            return [500, { error: "Password encryption failed!" }];
          }
        } else {
          return [500, { error: `Error reading user data: ${error.message}` }];
        }
      }
    } else {
      return [400, { error: "Check that you filled in data correctly" }];
    }
  } catch (error) {
    return [400, { error: `Incorrect data format: ${error.message}` }];
  }
};

handler._users.get = async (data) => {
  //check if phone number is valid
  try {
    const phone =
      typeof data.payload.phone == "string" && data.payload.phone
        ? data.payload.phone
        : false;
    if (phone) {
      try {
        const paylaodContent = await __data.read("users", phone);
        // @Todo is this delete funtional?
        delete paylaodContent.hashedPassword;
        return [200, paylaodContent];
      } catch (error) {
        console.log(error);
      }
    } else {
      return [500];
    }
  } catch (error) {
    console.log(error);
  }
};
