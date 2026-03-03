const errorMessage = {
    NOTFOUND : {
        status : 404,
        message : "Resource not found!"
    },
    LOGINERROR : {
        status : 401,
        message : "Invalid login credentials"
    },
    UNAUTHORIZED : {
        status : 403,
        message : "Forbidden!"
    },
    INVALIDDATA: {
        status: 400,
        message: "Please provide valid data"
    }

}

export { errorMessage }