import { Menu, MenuButton } from '.';

const Layout = ({ title, children, button }) => {
  return (
    <div className="font-body text-sm min-h-screen bg-gray-100 flex">
      <Menu />
      <main className="max w-full lg:col-span-5 p-4 lg:p-8 xl:px-12 gap-4">
        <div className="flex items-center mb-8">
          <div className="flex flex-1 items-center">
            <h3 className="text-2xl font-semibold">{title}</h3>
            {button && <div className="ml-3">{button}</div>}
          </div>
          <MenuButton />
        </div>
        <div className="grid gap-4">
          <div className="bg-white rounded-lg border border-gray-300 p-8 shadow-xl">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
