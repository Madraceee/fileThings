import { RootState } from "@/redux/store"
import { createContext, useCallback, useContext } from "react"
import { useSelector } from "react-redux"
import { getFolderFilesService, addFolderService, addFileService, deleteFileService, getFileService } from "@/services/workspace.service"


type workspaceInterface = {
    getUserFolders: (folderID: string) => Promise<any>,
    addFolder: (parentFolder: string, name: string) => Promise<boolean>,
    addFile: (parentFolder: string, file: File) => Promise<boolean>,
    deleteFile: (name: string, ID: string) => Promise<boolean>,
    getUserFile: (fileID: string, name: string) => Promise<Blob | null>
}

const workspaceContext = createContext<workspaceInterface>({} as workspaceInterface)

const WorkspaceProvider = ({ children }: any) => {
    const owner = useSelector((state: RootState) => state.user.email);

    const getUserFolders = useCallback(async (folderID: string) => {
        try {
            const data = await getFolderFilesService(folderID, owner);
            const folders = data.filter((obj) => obj.Type === "Folder")
            const files = data.filter((obj) => obj.Type === "File");
            return { folders, files }
        } catch (error) {
            return { folders: [], files: [] }
        }
    }, [owner]);

    const getUserFile = useCallback(async (fileID: string, name: string) => {
        try {
            const data = await getFileService(fileID, name);
            return data;
        } catch (error) {
            return null;
        }
    }, [owner]);

    const addFolder = useCallback(async (parentFolder: string, name: string) => {
        try {
            await addFolderService(parentFolder, name, owner);
            return true
        } catch (error) {

            return false;
        }
    }, [owner]);

    const addFile = useCallback(async (parentFolder: string, file: File) => {
        try {
            await addFileService(parentFolder, file, owner);
            return true;
        } catch (error) {

            return false;
        }
    }, [owner]);

    const deleteFile = useCallback(async (fileName: string, fileID: string) => {
        try {
            await deleteFileService(fileName, fileID, owner);
            return true;
        } catch (error) {
            return false;
        }
    }, [owner]);


    return (
        <workspaceContext.Provider value={{ getUserFolders, addFolder, addFile, deleteFile, getUserFile }}>
            {children}
        </workspaceContext.Provider>
    )
}


export function useWorkspace() {
    return useContext(workspaceContext)
}

export default WorkspaceProvider