import Display from "@/components/Display";
import { Viewer } from "@/components/Viewer";
import WorkspaceProvider from "@/hooks/workspace";
import { RootState } from "@/redux/store"
import { useState } from "react";
import { useSelector } from "react-redux"


export type FileType = {
    file: Blob,
    name: string
}

export default function Main() {

    const name = useSelector((state: RootState) => state.user.name);
    const [file, setFile] = useState<FileType | null>(null);

    return (
        <WorkspaceProvider>
            <div>{name}'s Storage</div>
            <div className="flex flex-col lg:flex-row w-full gap-5">
                <Display setFile={setFile} />
                {file !== null && <Viewer file={file} closeFile={() => setFile(null)} />}
            </div>

        </WorkspaceProvider>
    )
}
