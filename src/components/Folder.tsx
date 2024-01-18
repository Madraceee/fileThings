import { FolderIcon } from "lucide-react";
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from "./ui/context-menu";
import { ContextMenuItem } from "@radix-ui/react-context-menu";

interface props {
    name: string,
    onClick: () => void
}

export default function Folder({ name, onClick }: props) {
    const newName = name.substring(0, 12) + (name.length > 12 ? "..." : "")
    return (
        <>
            <div className="flex flex-col w-fit" onClick={onClick}>
                <ContextMenu>
                    <ContextMenuTrigger>
                        <FolderIcon width={75} height={75} />
                        <span className="break-words">{newName}</span>
                    </ContextMenuTrigger>
                    <ContextMenuContent className="px-2 py-1 hover:cursor-pointer">
                        <ContextMenuItem>Rename</ContextMenuItem>
                        <ContextMenuItem>Delete</ContextMenuItem>
                    </ContextMenuContent>
                </ContextMenu>
            </div>
        </>

    );
}