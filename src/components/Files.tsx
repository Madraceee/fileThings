import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@radix-ui/react-context-menu";
import { FilesIcon } from "lucide-react";

interface props {
    name: string,
    onClick: () => void,
    deleteSelectedFile: () => void
    rename: () => void,
    changeFolder: () => void,
}

export default function Files({ name, onClick, rename, deleteSelectedFile, changeFolder }: props) {
    const newName = name.substring(0, 12) + (name.length > 12 ? "..." : "")
    return (
        <>
            <div className="flex flex-col w-fit" onClick={onClick}>
                <ContextMenu>
                    <ContextMenuTrigger>
                        <FilesIcon width={75} height={75} />
                        <span className="break-words">{newName}</span>
                    </ContextMenuTrigger>
                    <ContextMenuContent className="px-2 py-1 hover:cursor-pointer bg-white rounded-md border-gray-900">
                        <ContextMenuItem onClick={(e) => { e.stopPropagation(); rename() }}>Rename</ContextMenuItem>
                        <ContextMenuItem onClick={(e) => { e.stopPropagation(); deleteSelectedFile() }}>Delete</ContextMenuItem>
                        <ContextMenuItem onClick={(e) => { e.stopPropagation(); changeFolder() }}>Change Folder</ContextMenuItem>
                    </ContextMenuContent>
                </ContextMenu>
            </div>
        </>

    );
}