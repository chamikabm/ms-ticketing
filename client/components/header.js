import Link from 'next/link';
// Client-side transitions between routes can be enabled via
// the Link component exported by next/link.

// External URLs, and any links that don't require a route navigation using /pages,
// don't need to be handled with Link; use the anchor tag for such cases instead.

export default ({ currentUser }) => {
  return (
      <nav className="navbar navbar-light bg-light">
        <Link href={'/'}>
          <a href="#" className="navbar-brand">GitTix</a>
        </Link>
        <div className="d-flex justify-content-end">
          <ul className="nav d-flex align-items-center">
            {currentUser ? 'SingOut' : 'SignIn'}
          </ul>
        </div>
      </nav>
  );
};