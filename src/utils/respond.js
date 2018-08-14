export const sendError = (msg = "server error", status = '500') => {
    // let error = new Error(msg)
    // error.statusCode = status
    // throw error
    res.status(status)
    res.send({msg})
}

export const sendRes = (res , obj, status = 200) => {
    // return {
    //     result: obj, options: {
    //         statusCode
    //     }
    // }
    //
    res.status(status)
    res.send(obj)
}