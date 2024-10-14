interface Props {
  threadId: string,
  currentUserImg: string,
  currentUserId: string
}

const Comment = ({ threadId, currentUserImg, currentUserId }: Props) => {
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
  )
}

export default Comment