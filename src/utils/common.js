export const asyncWrap = fn => async (req ,res , next)=>{
    try {
        await fn(req , res , next)
    }catch (e) {
        console.log(e)
        next(e)
    }
}