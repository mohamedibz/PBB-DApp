import { Disclosure, DisclosureButton } from '@headlessui/react';
import { Link } from 'react-router-dom'; // Importar Link de react-router-dom

const navigation = [
  { name: 'Messages', href: '/Create', current: false },
  { name: 'Authorized', href: '/Write', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function CreateNavBar() {
  return (
    <Disclosure as="nav" className="bg-primary border-b-2 border-yellow-700 w-full h-16">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">

          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
            </DisclosureButton>
          </div>

          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-center">
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-20">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href} // Usa 'to' en lugar de 'href'
                    className={classNames(
                      item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-red-900 hover:text-white',
                      'rounded-md px-3 py-2 text-sm font-medium'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </Disclosure>
  );
}
