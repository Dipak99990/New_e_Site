import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-bold text-gray-800">Oops!</h1>
      <p className="text-2xl text-gray-600 mt-4">
        We couldn't find the page you were looking for.
      </p>
      <Link href="/" legacyBehavior>
        <a className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg">
          Return to Home
        </a>
      </Link>
    </div>
  );
};

export default NotFoundPage;
