"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";

interface Params {
  userId: string,
  username: string,
  name: string,
  image: string,
  bio: string,
  path: string
}

export async function updateUser(
  {
    userId,
    username,
    name,
    image,
    bio,
    path,
  }: Params): Promise<void> {
  connectToDB();

  try {
    await User.findOneAndUpdate(
      {
        id: userId
      },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      {
        upsert: true
      }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }

  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`)
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();
    return await User.findOne({
      id: userId,
    });
  } catch (error: any) {
    console.log(error);
    throw new Error(`Failed to fetch user: ${error.message}`)
  }
};

export async function fetchUserPost(userId: string) {
  try {
    connectToDB();

    const threads = await User.findOne({ id: userId })
      .populate({
        path: "threads",
        model: Thread,
        populate: {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image id"
          }
        }
      })

    return threads;

  } catch (error: any) {
    console.log(error);
    throw new Error(`Failed when fetch user post: ${error.messsage}`);
  }
}

// This function is used for searching user
export async function fetchUsers({
  userId,
  // Default value
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string,
  // Optional
  searchString?: string,
  pageNumber?: number,
  pageSize?: number,
  sortBy?: SortOrder
}) {
  try {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    // Tìm kiếm không phân biệt chữ hoa, chữ thường của searchString
    const regex = new RegExp(searchString, "i");

    // Lọc loại trừ người dùng có id===userId (không tìm chính mình)
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }
    }

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } }
      ]
    }

    const sortOptions = { createdAt: sortBy };

    const userQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsersCount = await User.countDocuments(query);

    const users = await userQuery.exec();

    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext }
  } catch (error: any) {
    console.log(error);
    throw new Error(`Error when fetching user: ${error.message}`);
  }
};

export async function getActivity(userId: string) {
  try {
    connectToDB();

    // Find all threads created by the user
    const userThreads = await Thread.find({ author: userId });

    // Collect all the child thread ids (replies) from the children field
    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId }
    }).populate({
        path: "author",
        model: User,
        select: "name image _id"
      });

    return replies;


  } catch (error: any) {
    console.log(error);
    throw new Error(`Failed to fetch activity: ${error.message}`);
  }
}