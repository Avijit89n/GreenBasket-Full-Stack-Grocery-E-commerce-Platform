import axios from "axios"

const getHandler = async (url) => {
    try {
        const res = await axios.get(url, {withCredentials: true})
        return res.data
    } catch (error) {
        throw error
    }
}

export default getHandler;
