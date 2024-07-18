import { useNavigate } from 'react-router-dom';

export default function Logo() {
    const navigate = useNavigate();

    return (
        <div>
            <h1
                className="text-3xl font-bold cursor-pointer text-black"
                onClick={() => navigate('/')}
            >
                campus<span className='text-red-600 '>dox</span>
            </h1>
        </div>
    )
}
