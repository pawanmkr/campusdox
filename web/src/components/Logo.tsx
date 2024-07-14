import { useNavigate } from 'react-router-dom';

export default function Logo() {
    const navigate = useNavigate();

    return (
        <div>
            <h1
                className="text-3xl font-bold text-red-600 cursor-pointer"
                onClick={() => navigate('/')}
            >
                Dox<span className='text-black'>college</span>
            </h1>
        </div>
    )
}
