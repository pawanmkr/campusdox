import SignInBtn from './buttons/Signin';

interface SignInModalProps {
    goBack: () => void;
}

const SignInModal = ({ goBack }: SignInModalProps) => {

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" style={{ margin: 0 }}>
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm mx-auto">
                <h2 className="text-2xl font-semibold mb-4 text-center">Sign In Required</h2>
                <p className="text-gray-600 mb-8 text-center">
                    Please register yourself before uploading or downloading documents.
                </p>
                <div className="flex justify-center space-x-8 scale-110">
                    <SignInBtn />
                    <button
                        onClick={goBack}
                        className="text-gray-600 hover:text-gray-800 underline"
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignInModal;