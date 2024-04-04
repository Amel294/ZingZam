import { Button } from "@nextui-org/react";

import FourOFOur from '../../../public/404.gif'
import { useNavigate } from "react-router-dom";
const NotFound = () => {
    const navigate =  useNavigate()
    return (
        <div className="bg-black flex h-screen justify-center items-center flex-col">
            <img src={FourOFOur} alt="404 Image" className="h-40 "/>
            <div className="text-6xl py-10">Page not found</div>
            <Button color="secondary" className="px-12 py-6 text-xl text-center" onClick={()=>navigate('/')} >Back to Home</Button>
        </div>
    );
};

export default NotFound;