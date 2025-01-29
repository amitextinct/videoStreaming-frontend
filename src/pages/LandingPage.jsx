'use client'
import { CloudArrowUpIcon,  ServerIcon } from '@heroicons/react/20/solid'
import { VideoCameraIcon } from '@heroicons/react/24/outline'
import { useEffect, useRef } from 'react' // Add useRef
import { useNavigate } from 'react-router' // Add useNavigate
import { healthcheck } from '../services/Services'
import infoImage from '../assets/images/infoImage.png'

export default function Example() {
  const navigate = useNavigate(); // Add navigate hook
  const featuresRef = useRef(null); // Add ref for features section

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const isHealthy = await healthcheck();
        console.log('Server health status:', isHealthy);
      } catch (error) {
        console.error('Health check failed:', error);
      }
    };

    checkHealth();
  }, []);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        {/* First gradient div */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>

        {/* Main content */}
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              coded and deployed by Amit Mahto.{' '}
              <a 
                href="https://amitmahto.in" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                <span aria-hidden="true" className="absolute inset-0" />
                check my portfolio <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
              Watch and upload Videos
            </h1>
            <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
              Vidzy is a video sharing platform where you can watch and upload videos. It&apos;s a great way to share your videos with the world.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={() => navigate('/signup')}
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </button>
              <button 
                onClick={scrollToFeatures}
                className="text-sm/6 font-semibold text-gray-900 hover:text-indigo-600"
              >
                Learn more <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Second gradient div */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>

      {/* Features section - modify image container positioning */}
      <div ref={featuresRef} className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <svg
            aria-hidden="true"
            className="absolute top-0 left-[max(50%,25rem)] h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
          >
            <defs>
              <pattern
                x="50%"
                y={-1}
                id="e813992c-7d03-4cc4-a2bd-151760b470a0"
                width={200}
                height={200}
                patternUnits="userSpaceOnUse"
              >
                <path d="M100 200V.5M.5 .5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
              <path
                d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" width="100%" height="100%" strokeWidth={0} />
          </svg>
        </div>
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="lg:max-w-lg">
                <p className="text-base/7 font-semibold text-indigo-600">enjoy seamlessly</p>
                <h1 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                  Your daily dose of entertainment
                </h1>
                <p className="mt-6 text-xl/8 text-gray-700">
                  This project was made to implement the frontend for Hitesh Chaudhary&apos;s youtube clone. It is a great way to share your videos with the world.
                </p>
              </div>
            </div>
          </div>
          
          {/* Adjust image container positioning */}
          <div className="-mt-8 p-12 lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
            <img
              alt="Project screenshot"
              src={infoImage}
              className="w-[48rem] max-w-none rounded-xl bg-gray-900 ring-1 shadow-xl ring-gray-400/10 sm:w-[57rem] transform transition-transform hover:scale-105"
            />
          </div>

          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="max-w-xl text-base/7 text-gray-700 lg:max-w-lg">
                <p>
                  This project was implented with vite@react and tailwindcss. It helped me to understand the basics of react and tailwindcss.
                </p>
                <ul role="list" className="mt-8 space-y-8 text-gray-600">
                  <li className="flex gap-x-3">
                    <CloudArrowUpIcon aria-hidden="true" className="mt-1 size-5 flex-none text-indigo-600" />
                    <span>
                      <strong className="font-semibold text-gray-900">Deployed on Vercel. </strong> This project is deployed on Vercel&apos;s platform. Auto deploy on push to main branch. 
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <VideoCameraIcon aria-hidden="true" className="mt-1 size-5 flex-none text-indigo-600" />
                    <span>
                      <strong className="font-semibold text-gray-900">Videos hosted on Cloudinary</strong> Videos are hosted on Cloudinary&apos;s platform. It provides a no hassle way to host videos.
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <ServerIcon aria-hidden="true" className="mt-1 size-5 flex-none text-indigo-600" />
                    <span>
                      <strong className="font-semibold text-gray-900">Backend deployed on Render.</strong> Backend is deployed on Render&apos;s platform. It is a simple platform to host backend services.
                    </span>
                  </li>
                </ul>
                <p className="mt-8">
                  This was a great project to learn the basics of react and tailwindcss. It helped me to understand the basics of react and tailwindcss. 
                </p>
                <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">Special Mention</h2>
                <p className="mt-6">
                  This special mention goes to claude 3.5 sonnet that comes with github copilot. It helped me to write the code for this project.
                  It was a great learning experience to get ideas from copilot and implement them in the project. The debugging was also easy with copilot.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
