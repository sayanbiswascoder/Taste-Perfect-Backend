export default function Header({ onMenuClick }) {
    return (
        <header className="bg-white shadow-sm lg:static lg:overflow-y-visible">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative flex justify-between h-16">
                    <div className="flex items-center">
                        <button
                            type="button"
                            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                            onClick={onMenuClick}
                        >
                            <span className="sr-only">Open sidebar</span>
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                />
                            </svg>
                        </button>
                        <div className="ml-4 flex lg:ml-0">
                            <span className="font-bold text-xl text-purple-600">Taste Perfect</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
