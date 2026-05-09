import { createContext } from "react";
export const dataContext = createContext()
function UserContext({children}){

    const serverURL = "https://spimrify-backend.onrender.com"

    const value={
        serverURL
    }

    return(
        <dataContext.Provider value={value}>
           {children}
        </dataContext.Provider>
    )
}

export default UserContext