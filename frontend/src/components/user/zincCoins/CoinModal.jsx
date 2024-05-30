import { useState } from 'react';
import { Card, CardBody, CardHeader, Divider, Modal, ModalContent } from '@nextui-org/react';
import ZingCoinsIcon from '../../../../public/icons/ZingCoinsIcon';
import AxiosWithBaseURLandCredentials from '../../../axiosInterceptor';
import ZingZamLogo from '../../../../public/icons/ZingZamLogo.svg'
import { useDispatch, useSelector } from 'react-redux';
import { updateCoins } from '../../../store/auth/authSlice';

function CoinModal({ isCoinModelOpen, setIsCoinModelOpen }) {
    const [razorpayInstance, setRazorpayInstance] = useState(null);
    const [options,setOptions] = useState(null)
    const coinBalance = useSelector(state=>state.auth.coin)
    const dispatch  = useDispatch()
    const coinPacks =[
        {
            "name": "Starter Pack",
            "coins": 100,
            "price": 135
        },
        {
            "name": "Basic Pack",
            "coins": 480,
            "price": 648
        },
        {
            "name": "Value Pack",
            "coins": 1050,
            "price": 1417.50
        },
        {
            "name": "Premium Pack",
            "coins": 2800,
            "price": 3360
        },
        {
            "name": "Ultimate Pack",
            "coins": 6000,
            "price": 7200
        }
    ];
    const handleClose = () => {
        setIsCoinModelOpen(false);
    };
    
    const initPayment = (data) => {
    const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: data.name,
        description: "Zing Coins",
        order_id: data.id,
        image: ZingZamLogo,
        handler: async (response) => {
            try {
                const verifyUrl = `${import.meta.env.VITE_BASE_URL_BACKEND}/pay/verify`;
                const { data } = await AxiosWithBaseURLandCredentials.post(verifyUrl, response);
                console.log(data);
                setOptions(null);
                if(data?.newCoinBalance){
                    dispatch(updateCoins({coin:data.newCoinBalance}))
                }
            } catch (error) {
                console.log(error);
            }
        },
        theme: {
            color: "#7828C8",
        },
    };
    setOptions(options); 
    const rzp1 = new window.Razorpay(options);
    setRazorpayInstance(rzp1);
    rzp1.open();
};

    const handlePayment = async (pack) => {
        try {
            handleClose()
            const orderUrl = `${import.meta.env.VITE_BASE_URL_BACKEND}/pay/orders`;
            const { data } = await AxiosWithBaseURLandCredentials.post(orderUrl, { amount: pack.price, name: pack.name, coins: pack.coins });
            console.log(data);
            initPayment({
                amount: data.data.amount,
                currency: data.data.currency,
                name: data.data.name,
                img: data.data.img,
                id: data.data.id
            });
        } catch (error) {
            console.log(error);
        }
    };
    
    return (
        <Modal isOpen={isCoinModelOpen} onClose={handleClose} className="dark text-white " placement="center" size="md" hideCloseButton={true} backdrop="blur">
            <ModalContent>
                {(onClose) => (
                    <>
                        <Card className="">
                            <CardHeader className="flex justify-between px-5 gap-3">
                                <div className="flex flex-col">
                                    <p className="text-md">Buy Coins</p>
                                </div>
                                <div className='flex gap-2'>
                                    <span className='text-1xl'>{coinBalance}</span>
                                    <ZingCoinsIcon />
                                </div>
                            </CardHeader>
                            <Divider />
                            <CardBody className='grid grid-cols-3 gap-2'>
                            {coinPacks.map((pack) => (
                                <Card shadow="lg" isPressable onPress={() => handlePayment(pack)} className='w-[140px] border-1 border-zinc-400 ' key={pack.name}>
                                    <CardBody className="text-small justify-center">
                                        <div className="text-center">
                                            <span className='flex justify-center text-lg'>{pack.name}</span>
                                            <div className='flex justify-center gap-1 items-center w-full py-2'>
                                                <span className='text-2xl'>{pack.coins}</span>
                                                <ZingCoinsIcon/>
                                            </div>
                                            <p className=" bg-secondary-400 rounded text-white p-1">Buy @ ₹{pack.price}</p>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                            </CardBody>
                        </Card>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

export default CoinModal;
