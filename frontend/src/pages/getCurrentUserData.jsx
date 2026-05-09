import axios from "axios"
import { useContext, useEffect } from "react"
import { useDispatch } from "react-redux"
import { setUserData, setLoading } from "../../redux/userSlice" // setLoading import kiya
import { dataContext } from "./userContext."

const useGetCurrentUserData = () => {
    let { serverURL } = useContext(dataContext)
    let dispatch = useDispatch()

    useEffect(() => {
        const fetchData = async () => {
            if (!serverURL) return;

            try {
                const data = await axios.get(serverURL + "/getCurrentUser", {
                    withCredentials: true
                });
                dispatch(setUserData(data.data)); // Iske andar loading false ho jayegi
            } catch (error) {
                console.log(error);
                // 🔑 YE DO LINES ZAROORI HAIN:
                dispatch(setUserData(null));
                dispatch(setLoading(false)); // Taaki screen se loading hat jaye
            }
        };

        fetchData();
    }, [dispatch, serverURL]);
}

export default useGetCurrentUserData;