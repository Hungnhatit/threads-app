import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { fetchUser, getActivity } from '@/lib/actions/user.action';
import { currentUser } from '@clerk/nextjs/server';

async function Page() {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) {
    redirect('/onboarding');
  }

  // Get activity
  const activities = await getActivity(userInfo._id);

  return (
    <>
      <h2 className='text-white'>Activity</h2>

      <section className='mt-10 flex flex-col gap-5'>
        {activities.length > 0 ? (
          <>
            {activities.map((activity) => (
              <Link
                key={activity._id}
                href={`/thread/${activity.parentId}`}
              >
                <article className='activity-card'>
                  <Image
                    src={activity.author.image}
                    alt="Profile picture"
                    width={20}
                    height={20}
                    className='rounded-full object-cover'
                  ></Image>

                  <p className='!text-small-regular text-light-1'>
                    <span className='mr-1 text-primary-500'>
                      {activity.author.name}
                    </span>{" "}
                    replied to your thread
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <>
            <p className='!text-base-regular text-light-3'>No activity yet</p>
          </>
        )}
      </section>





    </>
  )
}

export default Page