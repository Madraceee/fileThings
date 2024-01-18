import Display from "@/components/Display";
import WorkspaceProvider from "@/hooks/workspace";
import { RootState } from "@/redux/store"
import { useSelector } from "react-redux"


export default function Main() {

    const name = useSelector((state: RootState) => state.user.name);

    return (
        <WorkspaceProvider>
            <div>{name}'s Storage</div>
            <Display />
        </WorkspaceProvider>
    )
}
