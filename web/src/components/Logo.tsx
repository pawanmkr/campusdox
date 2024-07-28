import { useNavigate } from 'react-router-dom';

export default function Logo() {
    const navigate = useNavigate();

    return (
        <div>
            <h1
                className="text-3xl font-bold cursor-pointer text-black"
                onClick={() => navigate('/')}
            >
                Campus<span className='text-red-600 '>DOX</span>
            </h1>
        </div>
    )
}
