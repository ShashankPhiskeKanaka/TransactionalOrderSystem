interface logError{
    status: number
    message : string
}

class logUtilsClass {
    logActivity = (message : string) => {
        console.log(`Activity Log : ${message}`);
    }

    logError = (data : logError) => {
        console.log(`Error Log -> status : ${data.status}, message : ${data.message}`);
    }
}

const logUtil = new logUtilsClass();

export { logUtil }
export type { logError }