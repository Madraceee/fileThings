import { useWorkspace } from "@/hooks/workspace"
import Menu from "./Menu"
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import Folder from "./Folder";
import Files from "./Files";
import { changeFolder } from "@/redux/user/userSlice";
import { useToast } from "./ui/use-toast";
import { FileType } from "@/pages/workspace/Main";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { DialogTrigger } from "@radix-ui/react-dialog";

type icon = {
    Name: string,
    ID: string,
    Type: string
}

const Display = ({ setFile }: { setFile: Dispatch<SetStateAction<FileType | null>> }) => {
    const folderID = useSelector((state: RootState) => state.user.folderID);
    const { getUserFolders, deleteFile, getUserFile, renameFileOrFolder, deleteFolder } = useWorkspace();
    const dispatch = useDispatch();
    const { toast } = useToast();

    const [foldersArr, setFoldersArr] = useState<icon[]>([]);
    const [filesArr, setFilesArr] = useState<icon[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [renameDialogOpen, setRenameDialogOpen] = useState<boolean>(false);
    const [renameFileID, setRenameFileID] = useState<string>("");
    const [newFileName, setNewFileName] = useState<string>("")


    useEffect(() => {
        const getFilesFolders = async () => {
            setLoading(true)
            setFoldersArr([]);
            setFilesArr([])
            const { folders, files } = await getUserFolders(folderID);
            if (folders.length) {
                setFoldersArr(folders);
            }
            if (files.length) {
                setFilesArr(files);
            }
            setLoading(false);
        }

        getFilesFolders();

    }, [folderID, refresh]);

    const updateFolderID = (id: string, name: string) => {
        dispatch(changeFolder({ folderID: id, newFolderName: name }));
    }

    const displayFile = async (fileID: string, fileName: string) => {
        const data = await getUserFile(fileID, fileName);
        if (data === null) {
            setFile(null)
        } else {
            setFile({ file: data, name: fileName })
        }
    }

    const deleteSelectedFile = async (name: string, id: string) => {
        const result = await deleteFile(name, id);
        if (result === true) {
            toast({
                title: "File Deleted",
            })
            setRefresh(!refresh)
        } else {
            toast({
                variant: "destructive",
                title: "Unable to delete File",
            })
        }
    }

    const deleteSelectedFolder = async (id: string) => {
        const result = await deleteFolder(id);
        if (result === true) {
            toast({
                title: "Folder Deleted",
            })
            setRefresh(!refresh)
        } else {
            toast({
                variant: "destructive",
                title: "Unable to delete Folder",
            })
        }
    }

    const openRenameDialogBox = (id: string) => {
        setRenameFileID(id);
        setRenameDialogOpen(true);
    }

    const rename = async () => {
        if (renameFileID === "") {
            return;
        }
        const result = await renameFileOrFolder(renameFileID, newFileName);
        if (result === true) {
            toast({
                title: "Rename Successfull",
            })
            setRefresh(!refresh)
        } else {
            toast({
                variant: "destructive",
                title: "Rename unsuccessfull",
            })
        }
        setRenameFileID("");
        setRenameDialogOpen(false);
    }

    return (
        <div className="w-full h-[80vh] rounded-md border-black border-2 flex flex-col">
            <Menu setRefresh={() => setRefresh(!refresh)} />
            <div className="flex flex-row gap-5 items-center flex-wrap px-10 py-5">
                {foldersArr.map((folder, index) => (
                    <Folder
                        key={index}
                        name={folder.Name}
                        onClick={() => updateFolderID(folder.ID, folder.Name)}
                        rename={() => openRenameDialogBox(folder.ID)}
                        deleteSelectedFolder={() => deleteSelectedFolder(folder.ID)}
                    />
                ))}
                {filesArr.map((file, index) => (
                    <Files
                        key={index}
                        name={file.Name}
                        onClick={() => displayFile(file.ID, file.Name)}
                        rename={() => openRenameDialogBox(file.ID)}
                        deleteSelectedFile={() => deleteSelectedFile(file.Name, file.ID)}
                    />
                ))}
            </div>
            <div className="w-full h-full flex flex-row justify-center items-center">
                {loading && <Loader2 width={100} height={100} className="animate-spin" />}
                {loading === false && foldersArr.length === 0 && filesArr.length === 0 && <span className="text-4xl font-bold">Nothing Found :/</span>}
            </div>
            <Dialog open={renameDialogOpen} onOpenChange={(open) => setRenameDialogOpen(open)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rename Folder</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        <Input type="text" placeholder="Enter Folder name" value={newFileName} onChange={(e) => setNewFileName(e.target.value)} />
                        <DialogTrigger>
                            <Button className="mt-2" onClick={rename}>Rename</Button>
                        </DialogTrigger>
                    </DialogDescription>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Display  