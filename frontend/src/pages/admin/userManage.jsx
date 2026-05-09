import { useSelector } from "react-redux"
import sf from "../../assets/sf.jpeg"
export const ManageUsers = () => {
let {otherUserData} = useSelector(state=>state.user)

return(
<div className="userMange">
 <h1 id="userMan" style={{textAlign:"center",backgroundColor:"",fontFamily:"arial black"}}>User Management</h1>
 {
                otherUserData && [...otherUserData].reverse().map((user,index)=>(
                    <div className="otherUser" key={index}>
                        <img src={user.profileImage || sf} id="otherUserImage"/>
                        <h1 id="userNames"style={{display:"inline",fontFamily:"arial black",fontSize:"19px"}}>@{user.userName}</h1>
                        <p id="date">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                ))
            }

</div>
)

}