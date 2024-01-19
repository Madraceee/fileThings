import supabase from "@/configs/supabase.config";
import { v4 as uuidv4 } from 'uuid';

const getFolderFilesService = async (parentFolderID: string, owner: string) => {
    const { data, error } = await supabase
        .from("folder_file")
        .select(`ID,Name,Type`)
        .eq("Owner", owner)
        .eq("Parent", parentFolderID);

    if (error) {
        console.log(error)
        throw new Error(`Cannot fetch Folders and Files - ${error}`)
    }

    return data;
}

const getAllFoldersService = async (owner: string) => {
    const { data, error } = await supabase
        .from("folder_file")
        .select("ID,Name")
        .eq("Owner", owner)
        .eq("Type", "Folder");

    if (error) {
        console.log(error)
        throw new Error(`Cannot fetch All Folders - ${error}`)
    }

    return data;
}

const getFileService = async (fileID: string, fileName: string) => {
    const extension = fileName.split(".").pop();

    const { data, error } = await supabase
        .storage
        .from("fileStorage")
        .download(`${fileID}.${extension}`);

    if (error) {
        console.log(error);
        throw new Error(`Cannot create a new Folder - ${error}`);
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

    const { error: error1 } = await supabase
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

const deleteFileService = async (fileName: string, fileID: string, owner: string) => {
    // Delete File from storage
    const extension = fileName.split(".").pop();
    const { error: error1 } = await supabase
        .storage
        .from("fileStorage")
        .remove([`${fileID}.${extension}`]);

    if (error1) {
        console.log(error1);
        throw new Error(`Cannot delete File - ${error1}`);
    }

    // Delete File record
    const { error: error2 } = await supabase
        .from("folder_file")
        .delete()
        .eq("Owner", owner)
        .eq("ID", fileID)

    if (error2) {
        console.log(error2);
        throw new Error(`Cannot delete File - ${error2}`);
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

const LoginService = async (email: string, password: string) => {
    const { data: data1, error: error1 } = await supabase
        .auth
        .signInWithPassword({
            email: email,
            password: password
        });

    if (error1) {
        console.log(error1);
        throw new Error(`Cannot login - ${error1}`);
    }

    let { data: data2, error: error2 } = await supabase
        .from('users')
        .select('parent_folder_id')
        .eq("email", email)

    if (error2) {
        console.log(error2);
        throw new Error(`Cannot login - ${error2}`);
    }

    let folderID;
    if (data2) {
        folderID = data2[0].parent_folder_id;
    }

    return { ...data1, folderID }
}

const CreateAcc = async (email: string, password: string) => {
    const { data: data1, error: error1 } = await supabase
        .auth
        .signUp({
            email: email,
            password: password
        });

    if (error1) {
        console.log(error1);
        throw new Error(`Cannot login - ${error1}`);
    }

    let { data: data2, error: error2 } = await supabase
        .from('users')
        .insert([{ email: email }])
        .select()

    if (error2) {
        console.log(error2);
        throw new Error(`Cannot login - ${error2}`);
    }

    let folderID;
    if (data2) {
        folderID = data2[0].parent_folder_id;
    }

    return { ...data1, folderID }
}

export {
    getFolderFilesService,
    addFolderService,
    deleteFolderService,
    deleteFileService,
    renameFileOrFolderService,
    MoveFileFolderService,
    addFileService,
    getFileService,
    LoginService,
    CreateAcc,
    getAllFoldersService
}