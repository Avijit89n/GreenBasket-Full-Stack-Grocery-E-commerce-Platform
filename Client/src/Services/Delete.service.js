import axios from "axios"

const deleteHandler = async (url) => {
    try {
        const res = await axios.delete(url)
        return res.data
    } catch (error) {
        throw error
    }
}

export default deleteHandler;
