"use client";
import Link from 'next/link';
import useSWR from 'swr';
import styles from './Home.module.css';

// Function to fetch data from the API
const fetcher = (url: string) => fetch(url).then(res => res.json());

// Home component
const Home: React.FC = () => {
  // Fetch posts data using SWR
  const { data, error } = useSWR('https://jsonplaceholder.typicode.com/posts', fetcher);

  // Show error message if there's an error
  if (error) return <div>Failed to load posts</div>
  // Show loading message while data is being fetched
  if (!data) return <div>Loading...</div>

  // Render posts data
  return (
    <div className={styles.container}>
      {data.map((post: { id: number, title: string, body: string }) => (
        <Link href={`/pages/Posts/${post.id}`} key={post.id}>
          <div>
            <b>{post.title}</b>
            <p>{post.body}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Home;