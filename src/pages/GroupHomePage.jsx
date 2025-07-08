import Header from "../components/Header";
import GroupHome from "../components/groupHome/GroupHome";
import GroupProvider from "../context/GroupProvider";

const GroupHomePage = () => {
    return (
        <GroupProvider>
            <Header />
            <GroupHome />
        </GroupProvider>
    );
};

export default GroupHomePage;
