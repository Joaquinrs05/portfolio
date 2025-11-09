interface GitHubCommit {
  message: string;
  date: string;
  repo: string;
  url: string;
}

export async function getLatestCommit(): Promise<GitHubCommit> {
  const username = import.meta.env.GITHUB_USERNAME;
  const token = import.meta.env.GITHUB_TOKEN;

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/events`,
      {
        headers: {
          Authorization: `token ${token}`,
          'User-Agent': 'Portfolio-App',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Error fetching GitHub data');
    }

    const events = await response.json();
    const lastPushEvent = events.find(
      (event: any) => event.type === 'PushEvent'
    );

    if (!lastPushEvent) {
      return {
        message: 'No hay commits recientes',
        date: new Date().toISOString(),
        repo: '',
        url: '',
      };
    }

    const commit = lastPushEvent.payload.commits[0];
    return {
      message: commit.message,
      date: lastPushEvent.created_at,
      repo: lastPushEvent.repo.name,
      url: `https://github.com/${lastPushEvent.repo.name}/commit/${commit.sha}`,
    };
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    return {
      message: 'Error al cargar el commit',
      date: new Date().toISOString(),
      repo: '',
      url: '',
    };
  }
}
