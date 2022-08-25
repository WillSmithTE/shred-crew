import { SkiFriendsBlog24822 } from "../../blogs/ski-friends-24.8.22";
import { dummyPosts } from "../../dummy_data/dummyBlogPosts";

export const staticBlogPosts = [
    {
      title: SkiFriendsBlog24822.title,
      id: 1,
      date: 1661355310,
      src: `${process.env.PUBLIC_URL}/images/logged_out/ski-friends.jpg`,
      snippet: SkiFriendsBlog24822.snippet,
      content: SkiFriendsBlog24822.content(),
    },
  ]
  