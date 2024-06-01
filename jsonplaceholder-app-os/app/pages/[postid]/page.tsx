
// pages/[postid]/[id].tsx
"use client";
import Link from 'next/link';
import { useParams } from 'next/navigation'
import useSWR from 'swr';

// Function to fetch data from the API
const fetcher = (url: string) => fetch(url).then(res => res.json());

// Post component
const Post: React.FC = () => {
  // Get post ID from route parameters
  const params = useParams();
  const id = params.postid;

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
      <b>{post.title}</b>
      <p>{post.body}</p>
      <Link href={`/pages/Users/${user.id}`} key={user.id}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      </Link>
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

/*
// pages/posts/[id].tsx
import useSWR from 'swr';
import { GetStaticPaths, GetStaticProps } from 'next';

interface Comment {
  id: number;
  name: string;
  body: string;
}

interface PostData {
  id: number; // Adding the 'id' field here to fix the TypeScript error
  title: string;
  body: string;
  userId: number;
}

interface UserData {
  name: string;
  email: string;
}

// Function to fetch data from the API
const fetcher = (url: string) => fetch(url).then(res => res.json());

// Post component
const Post: React.FC<{ post: PostData, comments: Comment[], user: UserData }> = ({ post, comments, user }) => {
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
        {comments.map((comment: Comment) => (
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

export const getStaticPaths: GetStaticPaths = async () => {
  // Fetch a list of post IDs from the API
  const posts: PostData[] = await fetcher('https://jsonplaceholder.typicode.com/posts');
  const paths = posts.map((post: PostData) => ({
    params: { id: post.id.toString() },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params || {};

  if (!id || typeof id !== 'string') {
    return {
      notFound: true,
    };
  }

  // Fetch post, comments, and user data using SWR
  const [postRes, commentsRes, userRes] = await Promise.all([
    fetcher(`https://jsonplaceholder.typicode.com/posts/${id}`),
    fetcher(`https://jsonplaceholder.typicode.com/posts/${id}/comments`),
    fetcher(`https://jsonplaceholder.typicode.com/users/${id}`) // Using 'id' here
  ]);

  const post: PostData = await postRes;
  const comments: Comment[] = await commentsRes;
  const user: UserData = await userRes;

  return {
    props: {
      post,
      comments,
      user
    }
  };
};
*/