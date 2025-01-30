export default function Skeletal() {
  return (
    <div className="min-h-screen container mx-auto px-4 py-8 animate-pulse">
      {/* Header section */}
      <div className="h-10 bg-gray-200 rounded-md w-72 mb-8"></div>
      
      {/* Main content section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white shadow rounded-lg overflow-hidden">
            {/* Thumbnail with duration placeholder */}
            <div className="relative">
              <div className="h-48 bg-gray-200 rounded-md w-full"></div>
              <div className="absolute bottom-2 right-2 bg-gray-300 w-12 h-5 rounded"></div>
            </div>
            <div className="p-4 space-y-4">
              {/* Title */}
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              {/* Meta info */}
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
