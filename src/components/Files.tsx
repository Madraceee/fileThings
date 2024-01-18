import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@radix-ui/react-context-menu";
import { FilesIcon } from "lucide-react";

interface props {
    name: string,
    onClick: () => void,
    deleteSelectedFile: () => void
}

export default function Files({ name, onClick, deleteSelectedFile }: props) {
    const newName = name.substring(0, 12) + (name.length > 12 ? "..." : "")
    return (
        <>
            <div className="flex flex-col w-fit" onClick={onClick}>
                <ContextMenu>
                    <ContextMenuTrigger>
                        <FilesIcon width={75} height={75} />
                        <span className="break-words">{newName}</span>
                    </ContextMenuTrigger>
                    <ContextMenuContent className="px-2 py-1 hover:cursor-pointer">
                        <ContextMenuItem>Rename</ContextMenuItem>
                        <ContextMenuItem onClick={deleteSelectedFile}>Delete</ContextMenuItem>
                    </ContextMenuContent>
                </ContextMenu>
            </div>
        </>

    );
}