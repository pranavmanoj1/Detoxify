import {
    Box,
    Button,
    CloseButton,
    Flex,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Textarea,
    Tooltip,
    useDisclosure,
} from "@chakra-ui/react";
import { IoVideocam } from "react-icons/io5";
import { useRef, useState } from "react";
import usePreviewVideo from "../../hooks/usePreviewVideo";
import useShowToast from "../../hooks/useShowToast";
import useAuthStore from "../../store/authStore";
import useReelStore from "../../store/reelStore";
import { addDoc, arrayUnion, collection, doc, updateDoc } from "firebase/firestore";
import { firestore, storage } from "../../firebase/firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useLocation } from "react-router-dom";
import useUserProfileStore from "../../store/userProfileStore";
const CreateReel = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [caption, setCaption] = useState("");
    const videoRef = useRef(null);
    const { handleVideoChange, selectedFile, setSelectedFile } = usePreviewVideo();
    const showToast = useShowToast();
    const { isLoading, handleCreateReel } = useCreateReel();

    const handleReelCreation = async () => {
        try {
            await handleCreateReel(selectedFile, caption);
            onClose();
            setCaption("");
            setSelectedFile(null);
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };

    return (
        <>
            <Tooltip
                hasArrow
                label={"Create Reel"}
                placement='right'
                ml={1}
                openDelay={500}
                display={{ base: "block", md: "none" }}
            >
                <Flex
                    alignItems={"center"}
                    gap={4}
                    _hover={{ bg: "whiteAlpha.400" }}
                    borderRadius={6}
                    p={2}
                    w={{ base: 10, md: "full" }}
                    justifyContent={{ base: "center", md: "flex-start" }}
                    onClick={onOpen}
                >
                    <IoVideocam />
                    <Box display={{ base: "none", md: "block" }}>Create Reel</Box>
                </Flex>
            </Tooltip>

            <Modal isOpen={isOpen} onClose={onClose} size='xl'>
                <ModalOverlay />

                <ModalContent bg={"black"} border={"1px solid gray"}>
                    <ModalHeader>Create Reel</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Textarea
                            placeholder='Reel caption...'
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                        />

                        <Input type='file' hidden ref={videoRef} onChange={handleVideoChange} accept="video/*" />

                        <IoVideocam 
                            onClick={() => videoRef.current.click()}
                            style={{ marginTop: "15px", marginLeft: "5px", cursor: "pointer" }}
                            size={16}
                        />
                        {selectedFile && (
                            <Flex mt={5} w={"full"} position={"relative"} justifyContent={"center"}>
                                <video src={selectedFile} controls />
                                <CloseButton
                                    position={"absolute"}
                                    top={2}
                                    right={2}
                                    onClick={() => {
                                        setSelectedFile(null);
                                    }}
                                />
                            </Flex>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button mr={3} onClick={handleReelCreation} isLoading={isLoading}>
                            Post
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default CreateReel;

function useCreateReel() {
    const showToast = useShowToast();
    const [isLoading, setIsLoading] = useState(false);
    const authUser = useAuthStore((state) => state.user);
    const createReel = useReelStore((state) => state.createReel);
    const addReel = useUserProfileStore((state) => state.addReel);
    const userProfile = useUserProfileStore((state) => state.userProfile);
    const { pathname } = useLocation();

    const handleCreateReel = async (selectedFile, caption) => {
        if (isLoading) return;
        if (!selectedFile) throw new Error("Please select a video");
        setIsLoading(true);
        const newReel = {
            caption: caption,
            likes: [],
            comments: [],
            createdAt: Date.now(),
            createdBy: authUser.uid,
        };

        try {
            const reelDocRef = await addDoc(collection(firestore, "reels"), newReel);
            const userDocRef = doc(firestore, "users", authUser.uid);
            const videoRef = ref(storage, `reels/${reelDocRef.id}`);

            await updateDoc(userDocRef, { reels: arrayUnion(reelDocRef.id) });
            await uploadString(videoRef, selectedFile, "data_url");
            const downloadURL = await getDownloadURL(videoRef);

            await updateDoc(reelDocRef, { videoURL: downloadURL });

            newReel.videoURL = downloadURL;

            if (userProfile.uid === authUser.uid) createReel({ ...newReel, id: reelDocRef.id });

            if (pathname !== "/" && userProfile.uid === authUser.uid) addReel({ ...newReel, id: reelDocRef.id });

            showToast("Success", "Reel created successfully", "success");
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, handleCreateReel };
}