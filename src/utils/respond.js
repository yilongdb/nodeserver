export const sendError = (msg = "server error", status = '500') => {
    let error = new Error(msg)
    error.statusCode = status
    throw error
}

export const sendRes = (obj, statusCode = 200) => {
    return {
        result: obj, options: {
            statusCode
        }
    }
}