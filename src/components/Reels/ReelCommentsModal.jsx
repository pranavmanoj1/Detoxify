import {
    Box,
    Button,
    Flex,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import useReelStore from "../../store/reelStore";
import useAuthStore from "../../store/authStore";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";

const ReelCommentsModal = ({ isOpen, onClose, reel }) => {
    const [comment, setComment] = useState("");
    const { addComment } = useReelStore();
    const authUser = useAuthStore((state) => state.user);

    const handleAddComment = async () => {
        const newComment = {
            text: comment,
            createdBy: authUser.uid,
            createdAt: Date.now(),
        };

        const reelDocRef = doc(firestore, "reels", reel.id);
        await updateDoc(reelDocRef, {
            comments: [...reel.comments, newComment],
        });
        addComment(reel.id, newComment);
        setComment("");
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Comments</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4} align="stretch">
                        {reel.comments.map((comment, index) => (
                            <Box key={index} p={4} borderWidth="1px" borderRadius="lg">
                                <Text>{comment.text}</Text>
                            </Box>
                        ))}
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Flex w="full" alignItems="center">
                        <Input
                            placeholder="Add a comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <Button onClick={handleAddComment} ml={2}>
                            Post
                        </Button>
                    </Flex>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ReelCommentsModal;