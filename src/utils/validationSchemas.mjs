import { query } from "express-validator";

export const createUserValidationSchema = {
username: {
    notEmpty: {
        errorMessage: "Username cannot be empty",
    },
    isLength: {
        options: { min: 3, max: 32 },
        errorMessage: "Username must be atleast 5 to 32 characters",
    },
    isString: {
        errorMessage: "Username must be a string!",
    },
},
displayName: {
    notEmpty: {
        errorMessage: true,
    },
}
};
