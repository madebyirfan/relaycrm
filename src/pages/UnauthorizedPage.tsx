'use client';

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-white dark:bg-black">
      <h1 className="text-4xl md:text-5xl font-bold text-red-600 dark:text-red-500">
        403 - Unauthorized
      </h1>
      <p className="mt-4 text-gray-700 dark:text-gray-300 text-base md:text-lg">
        You do not have permission to access this page.
      </p>
    </div>
  );
};

export default UnauthorizedPage;
