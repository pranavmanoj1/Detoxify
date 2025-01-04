import { Box, Button, Container, Flex, Text, VStack, IconButton, useDisclosure } from "@chakra-ui/react";
import { FaHeart, FaRegHeart, FaComment } from "react-icons/fa";
import useReelStore from "../../store/reelStore";
import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import ReelCommentsModal from "./ReelCommentsModal";
import useAuthStore from "../../store/authStore";
const ReelsView = () => {
    const { reels, setReels, addLike, removeLike } = useReelStore();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedReel, setSelectedReel] = useState(null);
    const authUser = useAuthStore((state) => state.user);

    useEffect(() => {
        const fetchReels = async () => {
            const querySnapshot = await getDocs(collection(firestore, "reels"));
            const fetchedReels = [];
            querySnapshot.forEach((doc) => {
                fetchedReels.push({ id: doc.id, ...doc.data() });
            });
            setReels(fetchedReels);
        };

        fetchReels();
    }, [setReels]);

    const handleLike = async (reel) => {
        const reelDocRef = doc(firestore, "reels", reel.id);
        if (reel.likes.includes(authUser.uid)) {
            await updateDoc(reelDocRef, {
                likes: reel.likes.filter((uid) => uid !== authUser.uid),
            });
            removeLike(reel.id, authUser.uid);
        } else {
            await updateDoc(reelDocRef, {
                likes: [...reel.likes, authUser.uid],
            });
            addLike(reel.id, authUser.uid);
        }
    };

    const handleOpenComments = (reel) => {
        setSelectedReel(reel);
        onOpen();
    };

    return (
        <Container maxW={"container.lg"}>
            <VStack spacing={4} align={"stretch"}>
                {reels.map((reel) => (
                    <Box key={reel.id} borderWidth="1px" borderRadius="lg" overflow="hidden">
                        <video src={reel.videoURL} controls />
                        <Flex p="6" alignItems="center" justifyContent="space-between">
                            <Text fontWeight="bold">{reel.caption}</Text>
                            <Flex alignItems="center">
                                <IconButton
                                    icon={reel.likes.includes(authUser.uid) ? <FaHeart /> : <FaRegHeart />}
                                    onClick={() => handleLike(reel)}
                                    variant="ghost"
                                    colorScheme="red"
                                    aria-label="Like"
                                />
                                <Text>{reel.likes.length}</Text>
                                <IconButton
                                    icon={<FaComment />}
                                    onClick={() => handleOpenComments(reel)}
                                    variant="ghost"
                                    colorScheme="blue"
                                    aria-label="Comment"
                                />
                            </Flex>
                        </Flex>
                    </Box>
                ))}
            </VStack>
            {selectedReel && (
                <ReelCommentsModal isOpen={isOpen} onClose={onClose} reel={selectedReel} />
            )}
        </Container>
    );
};

export default ReelsView;