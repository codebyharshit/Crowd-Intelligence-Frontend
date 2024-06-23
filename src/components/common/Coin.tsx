import coin from '../../assets/WissensMuenze.svg';
import { Image } from 'antd'; // or import from 'react-bootstrap' if you're using that library


const Coin = () => {

    return (    
        <>
            <Image src={coin} width={70} preview={false} alt="Coin" />
        </>
    )
}

export default Coin;
