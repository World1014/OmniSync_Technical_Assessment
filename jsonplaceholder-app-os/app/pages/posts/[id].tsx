// pages/posts/[id].tsx
"use client";
import { useRouter } from 'next/router';
import useSWR from 'swr';

// Function to fetch data from the API
const fetcher = (url: string) => fetch(url).then(res => res.json());

// Post component
const Post: React.FC = () => {
  // Get post ID from route parameters
  const router = useRouter();
  const { id } = router.query;

  // Fetch post, comments, and user data using SWR
  const { data: post, error: postError } = useSWR(`https://jsonplaceholder.typicode.com/posts/${id}`, fetcher);
  const { data: comments, error: commentsError } = useSWR(`https://jsonplaceholder.typicode.com/posts/${id}/comments`, fetcher);
  const { data: user, error: userError } = useSWR(post ? `https://jsonplaceholder.typicode.com/users/${post.userId}` : null, fetcher);

  // Show error message if there's an error
  if (postError || commentsError || userError) return <div>Failed to load post or comments</div>
  // Show loading message while data is being fetched
  if (!post || !comments || !user) return <div>Loading...</div>

  // Render post, user, and comments data
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <ul>
        {comments.map((comment: { id: number, name: string, body: string }) => (
          <li key={comment.id}>
            <h4>{comment.name}</h4>
            <p>{comment.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Post;