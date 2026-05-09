import axios from "axios"
import { useContext, useEffect } from "react"
import { useDispatch } from "react-redux"
import { setOtherUserData } from "../../redux/userSlice"
import { dataContext } from "./userContext."

const usegetOtherUserData = ()=>{
    let {serverURL} = useContext(dataContext)
    let dispatch = useDispatch()
    useEffect(()=>{
        const fetchOther = async(e)=>{
            try {
                let data = await axios.get(serverURL+"/getOther",{withCredentials:true})
                dispatch(setOtherUserData(data.data))
            } catch (error) {
                console.log(error)
                
            }
        }
        fetchOther()
    },[])
}
export default usegetOtherUserData