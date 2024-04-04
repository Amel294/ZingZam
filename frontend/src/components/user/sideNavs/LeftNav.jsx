import Home from "/icons/Home.svg";

export default function LeftNav() {
    return (
        <div className="max-h-[90vh] min-h-[90%]  border-1 rounded-lg min-w-[200px] fixed">
            <div className="flex flex-row gap-10 items-center">
                <img src={Home} alt="home" className="max-w-10"/>
                <div>Name</div>
            </div>
        </div>
    );
}
