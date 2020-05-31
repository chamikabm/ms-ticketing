import Link from 'next/link';
// Client-side transitions between routes can be enabled via
// the Link component exported by next/link.

// External URLs, and any links that don't require a route navigation using /pages,
// don't need to be handled with Link; use the anchor tag for such cases instead.

export default ({ currentUser }) => {
  const links = [
      !currentUser && { label: 'Sign Up', href: '/auth/signup' },
      !currentUser && { label: 'Sign In', href: '/auth/signin' },
      currentUser && { label: 'Sell Tickets', href: '/tickets/new' },
      currentUser && { label: 'My Orders', href: '/orders' },
      currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ]
      .filter(linkConfig => linkConfig)
      .map(({ label, href}) => (
          <li className={'nav-item'} key={href}>
            <Link href={href}>
              <a href="#" className="nav-link">
                {label}
              </a>
            </Link>
          </li>
      ));

  return (
      <nav className="navbar navbar-light bg-light">
        <Link href={'/'}>
          <a href="#" className="navbar-brand">GitTix</a>
        </Link>
        <div className="d-flex justify-content-end">
          <ul className="nav d-flex align-items-center">
            {links}
          </ul>
        </div>
      </nav>
  );
};