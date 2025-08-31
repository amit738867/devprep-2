import React from 'react'
import dayjs from "dayjs"
import Image from "next/image";
import { getRandomInterviewCover } from "@/lib/utils";
import { Button } from "./ui/button";
import Link from "next/link";
import DisplayTechIcons from "./DisplayTechIcons";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

const InterviewCard = async ({ 
  interviewId, 
  userId, 
  role, 
  type, 
  techstack, 
  createdAt 
}: InterviewCardProps) => {
  const feedback = userId && interviewId 
    ? await getFeedbackByInterviewId({ interviewId: interviewId, userId}) 
    : null; 
  
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;
  const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format("MMM D, YYYY");
  
  // Determine status and colors based on feedback
  const hasFeedback = !!feedback;
  const statusColor = hasFeedback 
    ? feedback.totalScore >= 80 ? "bg-green-100 text-green-800" : 
      feedback.totalScore >= 60 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
    : "bg-blue-100 text-blue-800";
  
  const statusText = hasFeedback 
    ? feedback.totalScore >= 80 ? "Excellent" : 
      feedback.totalScore >= 60 ? "Good" : "Needs Improvement"
    : "Not Taken";

  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 w-full max-w-md">
      {/* Status Badge */}
      <div className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
        {statusText}
      </div>
      
      {/* Card Content */}
      <div className="p-6">
        {/* Header with role and type */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200 mb-2">
              {normalizedType}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {role} Interview
            </h3>
          </div>
          
          {/* Cover Image */}
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-indigo-500 rounded-full blur-md opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <Image 
              src={getRandomInterviewCover()} 
              alt="interview cover" 
              width={70} 
              height={70} 
              className="relative rounded-full object-cover border-2 border-white dark:border-gray-700"
            />
          </div>
        </div>
        
        {/* Date and Score */}
        <div className="flex items-center gap-4 mb-5">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Image src="/calendar.svg" alt="calendar" width={16} height={16} className="mr-1.5" />
            <span>{formattedDate}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Image src="/star.svg" alt="star" width={16} height={16} className="mr-1.5" />
            <span className="font-medium">{feedback?.totalScore || "---"}/100</span>
          </div>
        </div>
        
        {/* Assessment */}
        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">
            {feedback?.finalAssessment || "You haven't taken this interview yet. Take it now to improve your skills."}
          </p>
        </div>
        
        {/* Tech Stack and Action */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex-1 mr-3">
            <DisplayTechIcons techStack={techstack} />
          </div>
          
          <Button 
            asChild
            className={`flex-shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              hasFeedback 
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg" 
                : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
            }`}
          >
            <Link href={feedback 
              ? `/interview/${interviewId}/feedback`
              : `/interview/${interviewId}`}>
                {feedback ? "Check Feedback" : "Start Interview"}
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
    </div>
  )
}

export default InterviewCard;