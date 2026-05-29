export default function Loading() {
  return (
    <div>
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-3" />
          <div className="h-9 w-56 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="h-5 w-96 bg-gray-100 rounded animate-pulse" />
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 h-44 animate-pulse">
              <div className="flex justify-between mb-3">
                <div className="h-5 w-16 bg-indigo-100 rounded-full" />
                <div className="h-4 w-20 bg-gray-100 rounded" />
              </div>
              <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-full bg-gray-100 rounded mb-1" />
              <div className="h-4 w-2/3 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
