import { useEffect, useState } from 'react';

export interface GitHubRepo {
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  html_url: string;
  language: string | null;
}

export function useGitHubRepo(slug: string) {
  const [repo, setRepo] = useState<GitHubRepo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://api.github.com/repos/${slug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setRepo(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  return { repo, loading };
}
