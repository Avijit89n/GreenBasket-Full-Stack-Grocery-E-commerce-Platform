import axios from "axios"

const postHandler = async (apiURL, formdata={}) => {
    try {
        const res = await axios.post(apiURL, formdata, {withCredentials: true})
        return res.data
    } catch (error) {
        throw error
    }
}

export default postHandler;