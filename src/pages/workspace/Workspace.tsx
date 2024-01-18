import { RootState } from "@/redux/store"
import { useSelector } from "react-redux"


export default function Workspace(){

    const name = useSelector((state:RootState)=> state.user.name);

    return(
        <div>
            <div className="">{name}'s Workspace</div>
            <div></div>
        </div>
    )
}
