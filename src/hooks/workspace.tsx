import { RootState } from "@/redux/store"
import { createContext, useCallback, useContext } from "react"
import { useSelector } from "react-redux"
import { getFolderFilesService, addFolderService, addFileService } from "@/services/workspace.service"


type workspaceInterface = {
    getUserFolders: (folderID: string) => Promise<any>,
    addFolder: (parentFolder: string, name: string) => Promise<boolean>,
    addFile: (parentFolder: string, file: File) => Promise<boolean>
}

const workspaceContext = createContext<workspaceInterface>({} as workspaceInterface)

const WorkspaceProvider = ({ children }: any) => {
    const owner = useSelector((state: RootState) => state.user.email);

    const getUserFolders = useCallback(async (folderID: string) => {
        try {
            const data = await getFolderFilesService(folderID, owner);
            return data
        } catch (error) {

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
    }, [owner])


    return (
        <workspaceContext.Provider value={{ getUserFolders, addFolder, addFile }}>
            {children}
        </workspaceContext.Provider>
    )
}


export function useWorkspace() {
    return useContext(workspaceContext)
}

export default WorkspaceProvider