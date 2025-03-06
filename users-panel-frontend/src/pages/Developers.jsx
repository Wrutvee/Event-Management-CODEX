import React from 'react';
import { Github, Linkedin } from 'lucide-react';

function Developers() {
  const developers = [
    {
      name: "Owaish Alam",
      image: "/images/owaish.jpg",
      linkedin: "https://www.linkedin.com/in/owaish-alam-a7393a314/",
      github: "https://github.com/owaish3301"
    },
    {
      name: "Wrutvee Anshika",
      image: "/images/wrutvee.jpg",
      linkedin: "https://www.linkedin.com/in/wrutvee-anshika-6556741b8/",
      github: "https://github.com/Wrutvee"
    }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Meet Our Developers
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            The Team behind EventHub
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {developers.map((developer, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl p-8"
            >
              <div className="h-40 w-40 rounded-full overflow-hidden border-4 border-indigo-100 shadow-inner mb-6">
                <img 
                  src={developer.image} 
                  alt={developer.name} 
                  className="h-full w-full object-cover object-center"
                  onError={(e) => {
                    e.target.src = "/images/740ecb78aa4c10cb0a2170ea2350c337.jpg";
                  }}
                />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{developer.name}</h2>
              <p className="text-lg text-gray-600 mb-6">Full Stack Developer</p>
              
              <div className="flex space-x-6">
                <a 
                  href={developer.linkedin} 
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Linkedin className="h-6 w-6 mr-2" />
                  <span className="font-medium">LinkedIn</span>
                </a>
                
                <a 
                  href={developer.github} 
                  className="flex items-center text-gray-800 hover:text-gray-600 transition-colors"
                >
                  <Github className="h-6 w-6 mr-2" />
                  <span className="font-medium">GitHub</span>
                </a>
              </div>
            </div>
          ))}
        </div>
        

      </div>
    </div>
  );
}

export default Developers;