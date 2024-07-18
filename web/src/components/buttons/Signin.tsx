import { FcGoogle } from "react-icons/fc";

const SignInBtn = () => {
    return (
        <button
            className="px-4 py-2 bg-gray-200 text-black text-2xl rounded hover:bg-gray-300 transition-colors flex items-center space-x-2"
            onClick={() => {
                window.location.href = `${import.meta.env.VITE_API_BASE_URL}/signin`
            }}
        >
            <FcGoogle />
            <p className="text-base">SignIn</p>
        </button>
    )
}

export default SignInBtn;