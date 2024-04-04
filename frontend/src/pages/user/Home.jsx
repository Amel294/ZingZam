import HomeCenter from "../../components/user/home/HomeCenter";
import HomeLeftSide from "../../components/user/home/HomeLeftSide";
import HomeRightSide from "../../components/user/home/HomeRightSide";

const Home = () => {
    console.log("I was in Home");
    return (
        <div className="h-auto grid grid-cols-1 lg:grid-cols-3  bg-black">
            <HomeLeftSide />
            <HomeCenter />
            <HomeRightSide />
        </div>
    );
};

export default Home;
