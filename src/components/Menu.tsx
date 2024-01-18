import { useSelector } from "react-redux"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Input } from "./ui/input"
import { RootState } from "@/redux/store"
import { useWorkspace } from "@/hooks/workspace"
import { ChangeEvent, useState } from "react"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"


const Menu = () => {

    const folderID = useSelector((state: RootState) => state.user.folderID);
    const { addFolder, addFile } = useWorkspace();
    const { toast } = useToast()

    const [folderName, setFolderName] = useState<string>("");
    const [file, setFile] = useState<File | null>(null)
    const [folderCreationLoading, setFolderCreationLoading] = useState<boolean>(false);
    const [fileUploadLoading, setFileUploadLoading] = useState<boolean>(false);

    const addFolderToWorkspace = async () => {
        setFolderCreationLoading(true);
        const result = await addFolder(folderID, folderName);
        if (result === true) {
            toast({
                title: "Folder creation Successful",
            })
        } else {
            toast({
                variant: "destructive",
                title: "Folder creation Unsuccessful",
            })
        }
        setFolderName("")
        setFolderCreationLoading(false);
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files;
        if (files) {
            setFile(files[0])
        }
    }

    const uploadFile = async () => {
        setFileUploadLoading(true);
        if (file) {
            const result = await addFile(folderID, file)
            if (result === true) {
                toast({
                    title: "File Uploaded Successful",
                })
            } else {
                toast({
                    variant: "destructive",
                    title: "File Not Uploaded",
                })
            }
        }
        setFile(null)
        setFileUploadLoading(false);
    }

    return (
        <div className="flex flex-row justify-between px-10 py-5">
            <span className="font-bold text-2xl">Path: { }</span>
            <div className="flex flex-row gap-5">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button disabled={folderCreationLoading}>
                            {folderCreationLoading ?
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> :
                                "Add Folder"
                            }
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Folder</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            <Input type="text" placeholder="Enter Folder name" value={folderName} onChange={(e) => setFolderName(e.target.value)} />
                            <DialogTrigger>
                                <Button className="mt-2" onClick={addFolderToWorkspace}>Add</Button>
                            </DialogTrigger>
                        </DialogDescription>
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button disabled={fileUploadLoading}>
                            {fileUploadLoading ?
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> :
                                "Add File"
                            }
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add File</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            <Input type="File" placeholder="Enter Folder name" onChange={handleFileChange} />
                            <DialogTrigger>
                                <Button className="mt-2" onClick={uploadFile}>Upload</Button>
                            </DialogTrigger>
                        </DialogDescription>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

export default Menu