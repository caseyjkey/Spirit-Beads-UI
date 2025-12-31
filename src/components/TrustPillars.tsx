export const TrustPillars = () => {
  const pillars = [
    {
      title: "Authentic Artistry",
      description: "Hand-beaded with traditional techniques."
    },
    {
      title: "Native Owned",
      description: "Directly supporting Indigenous creators."
    },
    {
      title: "Secure Transit",
      description: "Insured shipping in protective jewelry boxes."
    }
  ];

  return (
    <div className="py-6">
      <div className="text-center mb-6">
        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Why Choose Us</h3>
      </div>
      <div className="space-y-4">
        {pillars.map((pillar, index) => {
          return (
            <div key={index} className="flex items-center space-x-3 text-center">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                {index === 0 && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-primary">
                    <path d="M4 6h16M4 10h16M4 14h16M4 18h16M7 4v16M12 4v16M17 4v16" strokeLinecap="round" />
                  </svg>
                )}
                {index === 1 && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-primary">
                    <path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z" />
                  </svg>
                )}
                {index === 2 && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-primary">
                    <path d="M21 8l-9-4-9 4v8l9 4 9-4V8zM12 4v16M3 8l9 4 9-4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900">{pillar.title}</h4>
                <p className="text-xs text-gray-600 mt-0.5">{pillar.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
