"use server"
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"

interface Params {
  text: string,
  author: string,
  communityId: string | null,
  path: string
}
export async function createThread({ text, author, communityId, path }: Params) {
  try {
    connectToDB();

    const createdThread = await Thread.create({
      text,
      author,
      communityId: null
    });

    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id }
    });

    revalidatePath(path);
  } catch (error: any) {
    console.log(error);
    throw new Error(`An error occured when creating thread: ${error.message}`)
  };
};

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();

  const skipAmount = (pageNumber - 1) * pageSize;

  const postQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: "author", model: User })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image"
      }
    });

  const totalPostsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } })

  const posts = await postQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext }
};

export async function fetchThreadById(id: string) {
  connectToDB();
  try {
    const thread = await Thread.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image"
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image"
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image"
            }
          }
        ]
      }).exec();

    return thread;
  } catch (error: any) {
    console.log(error);
    throw new Error(`Error when fetching thread: ${error.message}`);
  }
}

export async function addCommentToThread(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();
  try {
    const originalThread = await Thread.findById(threadId);

    if (!originalThread) {
      throw new Error("Thread not found");
    }

    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId
    });

    // Save the new Thread
    const saveCommentThread = await commentThread.save();

    // Update the original thread to include the new comment
    originalThread.children.push(saveCommentThread._id);

    // Save the original thread
    await originalThread.save();

    revalidatePath(path);

  } catch (error: any) {
    console.log(error);
    throw new Error(`Error when adding comment to Thread: ${error.message}`);
  }

}