class ApiError extends Error{
    constructor(statusCode, message = "something ernt wrong", error=[]){
        super(message)
        this.statusCode = statusCode
        this.error = error
        this.success=false
        this.data=null
    }
}

export default ApiError