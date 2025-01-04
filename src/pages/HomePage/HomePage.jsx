import { Box, Button, Container, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import FeedPosts from "../../components/FeedPosts/FeedPosts";
import SuggestedUsers from "../../components/SuggestedUsers/SuggestedUsers";

const HomePage = () => {
    const navigate = useNavigate();

    const handleDiscoverReels = () => {
        navigate("/reels");
    };

    return (
        <Container maxW={"container.lg"}>
            
            <Flex gap={20}>
                <Box flex={2} py={10}>
                    <FeedPosts />
					<Flex justifyContent={"center"} alignItems={"center"} mb={4}>
                <Button onClick={handleDiscoverReels} colorScheme={"blue"}>
                    Discover Reels
                </Button>
            </Flex>
                </Box>
                <Box flex={3} mr={20} display={{ base: "none", lg: "block" }} maxW={"300px"}>
                    <SuggestedUsers />
                </Box>
            </Flex>
			
        </Container>
    );
};

export default HomePage;