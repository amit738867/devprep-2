import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

async function Home() {
  const user = await getCurrentUser();
  const [userInterviews, allInterview] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id! }),
  ]);
  const hasPastInterviews = userInterviews?.length! > 0;
  const hasUpcomingInterviews = allInterview?.length! > 0;

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 md:p-12 shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 max-w-xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200 mb-4">
              <span className="h-2 w-2 rounded-full bg-indigo-500 mr-2"></span>
              AI-Powered Interview Prep
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Get Interview-Ready with <span className="text-indigo-600 dark:text-indigo-400">AI</span>
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Practice real interview questions & get instant, personalized feedback to ace your next interview.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                <Link href="/interview">
                  Start an Interview
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-medium">
                <Link href="/dashboard">
                  View Dashboard
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-indigo-200 dark:bg-indigo-900/20 rounded-full blur-xl opacity-70 animate-pulse"></div>
              <Image
                src="/robot.png"
                alt="AI Interview Assistant"
                width={400}
                height={400}
                className="relative z-10 drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
          <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">100+</div>
          <div className="text-gray-600 dark:text-gray-400">Interview Questions</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
          <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">24/7</div>
          <div className="text-gray-600 dark:text-gray-400">AI Assistance</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
          <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">95%</div>
          <div className="text-gray-600 dark:text-gray-400">Success Rate</div>
        </div>
      </section>

      {/* Your Interviews Section */}
      <section className="my-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Interviews</h2>
          {hasPastInterviews && (
            <Link href="/your-interviews" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium flex items-center">
              View all
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          )}
        </div>
        
        {hasPastInterviews ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
            <div className="mx-auto w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No interviews yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">You haven't taken any interviews yet. Start practicing to improve your skills!</p>
            <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
              <Link href="/interview">Start Your First Interview</Link>
            </Button>
          </div>
        )}
      </section>

      {/* Take Interviews Section */}
      <section className="my-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Take Interviews</h2>
          {hasUpcomingInterviews && (
            <Link href="/interviews" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium flex items-center">
              View all
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          )}
        </div>
        
        {hasUpcomingInterviews ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allInterview?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
            <div className="mx-auto w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No interviews available</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Check back later for new interview opportunities.</p>
            <Button variant="outline">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 md:p-12 my-16 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to ace your next interview?</h2>
          <p className="text-lg text-indigo-100 mb-8">Join thousands of professionals who improved their interview skills with our AI-powered platform.</p>
          <Button asChild size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 font-medium shadow-lg">
            <Link href="/interview">
              Start Practicing Now
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}

export default Home;