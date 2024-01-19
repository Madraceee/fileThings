import { RootState } from "@/redux/store"
import { createContext, useCallback, useContext } from "react"
import { useSelector } from "react-redux"
import { getFolderFilesService, addFolderService, addFileService, deleteFileService, getFileService, renameFileOrFolderService, deleteFolderService, getAllFoldersService, MoveFileFolderService } from "@/services/workspace.service"


type workspaceInterface = {
    getUserFolders: (folderID: string) => Promise<any>,
    addFolder: (parentFolder: string, name: string) => Promise<boolean>,
    addFile: (parentFolder: string, file: File) => Promise<boolean>,
    deleteFile: (name: string, ID: string) => Promise<boolean>,
    getUserFile: (fileID: string, name: string) => Promise<Blob | null>,
    renameFileOrFolder: (fileID: string, newName: string) => Promise<boolean>,
    deleteFolder: (fileID: string) => Promise<boolean>,
    getAllFolders: () => Promise<any>,
    moveFile: (fileID: string, parentID: string) => Promise<boolean>
}

const workspaceContext = createContext<workspaceInterface>({} as workspaceInterface)

const WorkspaceProvider = ({ children }: any) => {
    const owner = useSelector((state: RootState) => state.user.email);
    const rootFolderID = useSelector((state: RootState) => state.user.rootFolderID)

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

    const deleteFolder = useCallback(async (fileID: string) => {
        try {
            await deleteFolderService(fileID, owner);
            return true;
        } catch (error) {
            return false;
        }
    }, [owner]);

    const renameFileOrFolder = useCallback(async (fileID: string, newName: string) => {
        try {
            await renameFileOrFolderService(fileID, newName, owner);
            return true;
        } catch (error) {
            return false;
        }
    }, [owner]);

    const getAllFolders = useCallback(async () => {
        try {
            const data = await getAllFoldersService(owner);
            data.push({ ID: rootFolderID, Name: "/" })
            return data;
        } catch (error) {
            return []
        }
    }, [owner]);

    const moveFile = useCallback(async (fileID: string, parentID: string) => {
        try {
            await MoveFileFolderService(fileID, parentID, owner);
            return true
        } catch (error) {
            return false;
        }
    }, [owner])

    return (
        <workspaceContext.Provider value={{ getUserFolders, addFolder, addFile, deleteFile, getUserFile, renameFileOrFolder, deleteFolder, getAllFolders, moveFile }}>
            {children}
        </workspaceContext.Provider>
    )
}


export function useWorkspace() {
    return useContext(workspaceContext)
}

export default WorkspaceProvider