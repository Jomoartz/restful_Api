// These are the request handlers
import { data as __data } from "./data.mjs";
import { helpers } from "./helpers.mjs";
import { valiateData } from "../utitlity/userDataValidator.mjs";

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
  } else if (data.method == "put") {
    return await handler._users.put(data);
  } else if (data.method == "delete") {
    return await handler._users.delete(data);
  } else {
    return [405];
  }
};

handler._users = {};

handler._users.post = async (data) => {
  try {
    // Declare and validate data
    const validData = await valiateData(data);
    if (
      validData.firstName &&
      validData.lastName &&
      validData.phone &&
      validData.password &&
      validData.tosAgreement
    ) {
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
      typeof data.queryString.phone == "string" && data.queryString.phone
        ? data.queryString.phone
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

//users -put
//required data:phone
handler._users.put = async (data) => {
  const validData = await valiateData(data);
  // Check for the required field
  const phone = validData.phone;
  // Check for optional fields
  if (phone) {
    if (validData.firstName || validData.lastName || validData.password) {
      const userData = await __data.read("users", phone);
      if (validData.firstName) {
        userData.firstName = validData.firstName;
      }
      if (validData.lastName) {
        userData.lastName = validData.lastName;
      }
      if (validData.password) {
        userData.hashedPassword = validData.password;
      }

      try {
        await __data.update("users", phone, userData);
        return [200, { update: "data updated succesfully" }];
      } catch (error) {
        return [400, { error: "could not update the user" }];
      }
    } else {
      return [400, { Error: "missing fields to update" }];
    }
  } else {
    return [400, { Error: "Missing requied fields" }];
  }
};

handler._users.delete = async (data) => {
  //check if phone number is valid
  try {
    const phone =
      typeof data.queryString.phone == "string" && data.queryString.phone
        ? data.queryString.phone
        : false;
    if (phone) {
      try {
        const paylaodContent = await __data.read("users", phone);
        if (paylaodContent) {
          await __data.delete("users", phone);
          return [200, { Update: "Data successfully deleted" }];
        }
      } catch (error) {
        console.log(error);
        return [500, { error: "Could not delete the specified user" }];
      }
    } else {
      return [500, { error: "Could not find the specified user" }];
    }
  } catch (error) {
    return [400, { error: "User Phone number is not valid " }];
  }
};

