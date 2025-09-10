import { LogOut, Heart } from 'lucide-react';
import { User } from '../models/user.model';
import { AvatarName } from './AvatarName';

// interface User {
//   name: string;
//   email: string;
//   type: 'patient' | 'doctor';
//   imageUrl?: string;
// }

interface HeaderProps {
  user?: User;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-4">
      <div className="flex items-center justify-between">
        {/* App Title and Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl text-gray-800">MediCare</h1>
            <p className="text-sm text-gray-600">Healthcare Platform</p>
          </div>
        </div>

        {/* User Info and Logout */}
        {user && (
          <div className="flex justify-end items-center gap-3">
            <div className="flex items-center gap-3">
              {/* User Avatar and Info */}
              {/* <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                  <div className="w-full h-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                    <span className="text-white text-sm">
                      {user.name
                        .split(' ')
                        .slice(0, 2)
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </span>
                  </div>
                </div>
              </div> */}
              <AvatarName name={user.name} />
              <div className="hidden sm:block">
                <p className="text-sm text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-600 capitalize">{user.role}</p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
