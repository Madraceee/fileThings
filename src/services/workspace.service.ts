import supabase from "@/configs/supabase.config";
import { v4 as uuidv4 } from 'uuid';

const getFolderFilesService = async (parentFolderID: string, owner: string) => {
    const { data, error } = await supabase
        .from("folder_file")
        .select(`ID,Name,Type`)
        .eq("Parent", parentFolderID)
        .eq("Owner", owner);

    if (error) {
        console.log(error)
        throw new Error(`Cannot fetch Folders and Files - ${error}`)
    }

    return data;
}

const addFolderService = async (parentFolderID: string, folderName: string, owner: string) => {
    const { error } = await supabase
        .from("folder_file")
        .insert({ Name: folderName, Parent: parentFolderID, Type: "Folder", Owner: owner });

    if (error) {
        console.log(error);
        throw new Error(`Cannot create a new Folder - ${error}`);
    }
}

const addFileService = async (parentFolderID: string, file: File, owner: string) => {
    const id = uuidv4();
    const extension = file.name.split(".").pop();

    const { data: _, error: error1 } = await supabase
        .storage
        .from("fileStorage")
        .upload(`${id}.${extension}`, file);

    if (error1) {
        console.log(error1)
        throw new Error(`Cannot add File - ${error1}`)
    }

    const { error: error2 } = await supabase
        .from("folder_file")
        .insert({ ID: id, Name: file.name, Parent: parentFolderID, Type: "File", Owner: owner })
    if (error2) {
        console.log(error2)
        throw new Error(`Cannot add File - ${error2}`)
    }
}

const deleteFolderService = async (folderID: string, owner: string) => {
    // Delete Files from storage

    // Delete File Records and Folder Records
    const { error: error1 } = await supabase
        .from("folder_file")
        .delete()
        .eq("Owner", owner)
        .eq("ID", folderID);

    if (error1) {
        console.log(error1);
        throw new Error(`Cannot delete Folder - ${error1}`);
    }


    const { error: error2 } = await supabase
        .from("folder_file")
        .delete()
        .eq("Owner", owner)
        .eq("Parent", folderID);

    if (error2) {
        console.log(error2);
        throw new Error(`Cannot delete Folder - ${error2}`);
    }
}

const deleteFileService = async (fileID: string, owner: string) => {
    // Delete File from storage

    // Delete File record
    const { error } = await supabase
        .from("folder_file")
        .delete()
        .eq("Owner", owner)
        .eq("ID", fileID)

    if (error) {
        console.log(error);
        throw new Error(`Cannot delete File - ${error}`);
    }
}

const renameFileOrFolderService = async (ID: string, newName: string, owner: string) => {
    const { error } = await supabase
        .from("folder_file")
        .update({ Name: newName })
        .eq("Owner", owner)
        .eq("ID", ID)

    if (error) {
        console.log(error);
        throw new Error(`Cannot Rename File/Folder - ${error}`);
    }
}

const MoveFileFolderService = async (ID: string, newParent: string, owner: string) => {
    const { error } = await supabase
        .from("folder_file")
        .update({ Parent: newParent })
        .eq("ID", ID)
        .eq("Owner", owner)

    if (error) {
        console.log(error);
        throw new Error(`Cannot move File/Folder - ${error}`);
    }
}

export {
    getFolderFilesService,
    addFolderService,
    deleteFolderService,
    deleteFileService,
    renameFileOrFolderService,
    MoveFileFolderService,
    addFileService
}