import { useState } from "react";
import useShowToast from "./useShowToast";

const usePreviewVideo = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const showToast = useShowToast();
    const maxFileSizeInBytes = 50 * 1024 * 1024; // 50MB

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("video/")) {
            if (file.size > maxFileSizeInBytes) {
                showToast("Error", "File size must be less than 50MB", "error");
                setSelectedFile(null);
                return;
            }
            const reader = new FileReader();

            reader.onloadend = () => {
                setSelectedFile(reader.result);
            };

            reader.readAsDataURL(file);
        } else {
            showToast("Error", "Please select a video file", "error");
            setSelectedFile(null);
        }
    };

    return { handleVideoChange, selectedFile, setSelectedFile };
};

export default usePreviewVideo;