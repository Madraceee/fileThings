import { X } from "lucide-react";
import { Button } from "./ui/button";
import { FileType } from "@/pages/workspace/Main";

interface props {
    file: FileType,
    closeFile: () => void
}

export function Viewer({ file, closeFile }: props) {
    const fileType = file.file.type;
    const fileURL = URL.createObjectURL(file.file);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = file.name;
        link.click();
        URL.revokeObjectURL(fileURL);
    }
    return (
        <div className="w-full min-h-[75vh]">
            <div className="flex flex-row justify-between my-2">
                <span className="text-2xl">Viewer</span>
                <Button onClick={handleDownload}>Download</Button>
                <Button onClick={closeFile}><X /></Button>
            </div>
            {fileType === 'application/pdf' ? (
                <iframe
                    src={fileURL}
                    className="w-full min-h-[75vh]"
                    title="PDF Document"
                />
            ) : fileType.startsWith('image/') ? (
                <img src={fileURL} alt="Image" className="aspect-auto max-h-[80vh]" />
            ) : (
                <div className="flex flex-col h-full items-center justify-center gap-5">
                    <span className="text-4xl font-bold">Not Supported</span>
                </div>
            )}
        </div>
    );
}
