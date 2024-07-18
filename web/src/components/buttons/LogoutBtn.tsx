import { RiLogoutCircleFill } from "react-icons/ri";

export default function LogoutBtn() {
    return (
        <button
            className="px-4 py-2 bg-gray-200 text-black text-xl rounded hover:bg-gray-300 transition-colors flex items-center space-x-2"
            onClick={async () => localStorage.clear()}
        >
            <RiLogoutCircleFill />
            <p className="text-base underline">Logout</p>
        </button>
    )
}