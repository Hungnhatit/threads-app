import React from 'react'
import Image from 'next/image';
import { redirect } from 'next/navigation';
import ProfileHeader from '@/components/shared/ProfileHeader';
import ThreadsTab from '@/components/shared/ThreadsTab';
import { profileTabs } from '@/constants';
import { fetchUser, fetchUsers } from '@/lib/actions/user.action';
import { currentUser } from '@clerk/nextjs/server';
import { TabsContent } from '@radix-ui/react-tabs';
import UserCard from '@/components/cards/UserCard';

async function Page() {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) {
    redirect('/onboarding');
  }

  const result = await fetchUsers({
    userId: user.id,
    searchString: "",
    pageNumber: 1,
    pageSize: 25
  })

  return (
    <section>
      <h1 className='head-text'>Search</h1>

      <div className='mt-14 flex flex-col gap-9'>
        {result.users.length === 0
          ? (
            <p className='no-result'>No users found</p>
          )
          : (<>
            {result.users.map((person) => (
              <UserCard
                key={person.id}
                id={person.id}
                name={person.name}
                username={person.username}
                imgUrl={person.image}
                personType="User"
              />
            ))}
          </>)
        }
      </div>

      <div>

      </div>







    </section>
  )
}

export default Page