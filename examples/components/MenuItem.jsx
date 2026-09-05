import { useRouter } from 'next/router';
import { Link } from '.';
import { classnames } from '../lib';

const MenuItem = ({ href, children }) => {
  const { pathname } = useRouter();
  const active = pathname === href;

  return (
    <Link
      aria-current={active ? 'page' : undefined}
      className={classnames('site-link', active && 'is-active')}
      href={href}
    >
      {children}
    </Link>
  );
};

export default MenuItem;
