import Display from "@/components/Display";
import { Viewer } from "@/components/Viewer";
import { Button } from "@/components/ui/button";
import WorkspaceProvider from "@/hooks/workspace";
import { logout } from "@/redux/user/userSlice";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";

export type FileType = {
    file: Blob,
    name: string
}

export default function Workspace() {
    const dispatch = useDispatch()
    const [file, setFile] = useState<FileType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    return (
        <WorkspaceProvider>
            <div className="w-full flex flex-row justify-between">
                <span className="w-full text-left text-2xl my-2 font-bold">Storage</span>
                <Button onClick={() => dispatch(logout())}>Logout</Button>
            </div>
            <div className="flex flex-col lg:flex-row w-full gap-5">
                <Display setFile={setFile} setIsLoading={setIsLoading} />
                {isLoading && <div className="w-full flex justify-center items-center "><Loader className="animate-spin w-200 h-200" /></div>}
                {file !== null && <Viewer file={file} closeFile={() => setFile(null)} />}
            </div>
        </WorkspaceProvider>
    )
}
