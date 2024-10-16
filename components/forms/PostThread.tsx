'use client'
import React, { ChangeEvent, useState } from 'react'

import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { UserValidation } from '@/lib/validations/user';
import { usePathname, useRouter } from 'next/navigation';
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from 'next/image';
import { Textarea } from '../ui/textarea';
import { isBase64Image } from '@/lib/utils';
import { useUploadThing } from '@/lib/uploadthing';
import { updateUser } from '@/lib/actions/user.action';
import { ThreadValidation } from '@/lib/validations/thread';
import { createThread } from '@/lib/actions/thread.action';

interface Props {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string
};

// -------------< Main function >------------
// PostThread nhận userId dưới dạng props
function PostThread({ userId }: { userId: string }) {
  const router = useRouter();
  const pathname = usePathname();


  const form = useForm({
    // Validate
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      accountId: userId
    }
  });


  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    await createThread({
      text: values.thread,
      author: userId,
      communityId: null,
      path: pathname,
    });
    router.push("/");
  }


  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10 mt-10"
        >
          <FormField
            control={form.control}
            name="thread"
            render={({ field }) => (
              <FormItem className='w-full flex flex-col gap-3'>
                <FormLabel className='text-base-semibold text-gray-200'>
                  Content
                </FormLabel>

                <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                  <Textarea
                    rows={15}

                    {...field}
                  ></Textarea>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}




          />




          <Button
            type="submit"
            className="bg-primary-500"
          >Post Thread</Button>
        </form>





      </Form>
    </>
  );

}

export default PostThread;