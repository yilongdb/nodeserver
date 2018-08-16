

// function sendRes(data , status = 200) {
//     this.status(status)
//     this.send(data)
// }

const send = function(req , res , next){

    res.sendRes = function(data , status = 200){
        res.status(status)
        res.send(data)
    }


    res.sendError = (message = "server error", status = '500') => {
        res.status(status)
        res.send({message})
    }

    next()
}


export default function applyMiddles(app){
    app.use(send)
}