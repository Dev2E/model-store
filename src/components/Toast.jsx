import { useCart } from '../context/CartContext';
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export default function Toast() {
  const { notifications, dismissNotification } = useCart();

  const renderIcon = (type) => {
    const iconProps = 'w-5 h-5';
    switch (type) {
      case 'success':
        return <CheckCircleIcon className={iconProps} />;
      case 'error':
        return <ExclamationCircleIcon className={iconProps} />;
      case 'info':
      default:
        return <InformationCircleIcon className={iconProps} />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          onClick={() => dismissNotification(notification.id)}
          className={`pointer-events-auto px-4 py-3 rounded-lg shadow-lg text-white font-medium text-sm animate-in fade-in slide-in-from-right-4 duration-300 cursor-pointer ${
            notification.type === 'success'
              ? 'bg-green-500 hover:bg-green-600'
              : notification.type === 'error'
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          <div className="flex items-center gap-2">
            {renderIcon(notification.type)}
            {notification.message}
          </div>
        </div>
      ))}
    </div>
  );
}
