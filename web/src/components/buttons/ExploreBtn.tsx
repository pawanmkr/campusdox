import { useNavigate } from "react-router-dom";
import { MdExplore } from "react-icons/md";


const ExploreBtn = () => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => {
                navigate('/results');
            }}
            className="px-4 py-2 rounded text-2xl bg-black text-white hover:bg-gray-300 hover:text-black transition-colors flex items-center space-x-2"
        >
            <MdExplore />
            <p className="text-base">Explore All Documents</p>
        </button>
    )
}

export default ExploreBtn;