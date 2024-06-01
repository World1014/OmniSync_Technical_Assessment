// pages/users/[id].tsx
"use client";
import { useRouter } from 'next/router';
import useSWR from 'swr';

// Function to fetch data from the API
const fetcher = (url: string) => fetch(url).then(res => res.json());

// User component
const User: React.FC = () => {
  // Get user ID from route parameters
  const router = useRouter();
  const { id } = router.query;

  // Fetch user and posts data using SWR
  const { data: user, error: userError } = useSWR(`https://jsonplaceholder.typicode.com/users/${id}`, fetcher);
  const { data: posts, error: postsError } = useSWR(`https://jsonplaceholder.typicode.com/users/${id}/posts`, fetcher);

  // Show error message if there's an error
  if (userError || postsError) return <div>Failed to load user or posts</div>
  // Show loading message while data is being fetched
  if (!user || !posts) return <div>Loading...</div>

  // Render user and posts data
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <h2>Posts by {user.name}</h2>
      <ul>
        {posts.map((post: { id: number, title: string, body: string }) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default User;