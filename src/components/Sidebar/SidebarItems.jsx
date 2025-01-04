import CreatePost from "./CreatePost";
import Home from "./Home";
import Notifications from "./Notifications";
import ProfileLink from "./ProfileLink";
import Search from "./Search";
import CreateReel from "./CreateReel";

const SidebarItems = () => {
	return (
		<>
			<Home />
			<Search />
			<Notifications />
			<CreatePost />
			<CreateReel />
			<ProfileLink />
		</>
	);
};

export default SidebarItems;
