import InterviewCard from '@/components/InterviewCard'
import { Button } from '@/components/ui/button'
import { dummyInterviews } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <>
      <section className='flex flex-row blue-gradient-dark rounded-3xl px-16 py-6 items-center justify-between max-sm:px-4'>
        <div className='flex flex-col gap-6 max-w-lg' >
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className='text-lg'>
            Practice on real interview questions & get instant feedback
          </p>
          <Button asChild className='w-fit !bg-primary-200 max-sm:w-full !text-dark-100 hover:!bg-primary-200/80 !rounded-full !font-bold px-5 cursor-pointer min-h-10 ' >
            <Link href='/interview'>Start an Interview</Link>
          </Button>
        </div>
        <Image src='/robot.png' alt='robo-dude' height={400} width={400} className='max-sm:hidden' />
      </section>
      <section className='flex flex-col gap-6 mt-8'>
        <h2>Your Interviews</h2>
        
        <div className='flex flex-wrap gap-4 max-lg:flex-col w-full items-stretch'>
          {dummyInterviews.map((interview)=>
          ///Rendering interview cards///
            <InterviewCard key={interview.id} {...interview} />
            )}
        </div>
      </section>
      <section className='flex flex-col gap-6 mt-8'>
        <h2>Take an Interview</h2>
        <div className='flex flex-wrap gap-4 max-lg:flex-col w-full items-stretch'>
            {dummyInterviews.map((interview)=>
                <InterviewCard key={interview.id} {...interview} />
                )}
          {/* <p>There are no interviews available yet</p> */}
        </div>
      </section>
    </>
  )
}

export default page