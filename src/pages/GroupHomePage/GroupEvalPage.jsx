import Header from "../../components/Header";
import GroupEval from "../../components/groupHome/GroupEval";
import GroupProvider from "../../context/GroupProvider";

const GroupEvalPage = () => {
    return (
        <div>
            <GroupProvider>
                <Header />
                <GroupEval />
            </GroupProvider>
        </div>
    );
};

export default GroupEvalPage;
