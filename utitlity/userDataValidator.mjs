export const valiateData = async (data) => {
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

  return {
    firstName: firstName,
    lastName: lastName,
    phone: phone,
    password: password,
    tosAgreement: tosAgreement,
  };
};
