import { Dialog, Tab } from '@headlessui/react';
import PropTypes from 'prop-types';
import { XMarkIcon } from '@heroicons/react/24/outline';
import SubscriptionsList from './SubscriptionsList';

export default function SubscriptionsOverlay({ isOpen, onClose, userId }) {
  const tabs = [
    { name: 'Subscribers', type: 'subscribers' },
    { name: 'Subscribed Channels', type: 'subscribed' }
  ];

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-4xl bg-white rounded-xl shadow-xl">
          <div className="relative">
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Channel Subscriptions
              </Dialog.Title>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <Tab.Group>
                <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1">
                  {tabs.map((tab) => (
                    <Tab
                      key={tab.name}
                      className={({ selected }) =>
                        `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                        ${selected
                          ? 'bg-white text-blue-600 shadow'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-white/[0.12]'
                        }`
                      }
                    >
                      {tab.name}
                    </Tab>
                  ))}
                </Tab.List>
                <Tab.Panels className="mt-6">
                  {tabs.map((tab) => (
                    <Tab.Panel key={tab.type} className="p-3">
                      <SubscriptionsList userId={userId} type={tab.type} />
                    </Tab.Panel>
                  ))}
                </Tab.Panels>
              </Tab.Group>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

SubscriptionsOverlay.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired
};
