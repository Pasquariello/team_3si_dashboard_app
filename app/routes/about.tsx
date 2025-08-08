import type { Route } from './+types/about';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'About Page' }, { name: 'description', content: 'About' }];
}

export default function About() {
  return <div>Hello From About</div>;
}
