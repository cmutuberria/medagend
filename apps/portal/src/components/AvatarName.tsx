interface AvatarNameProps {
  name: string;
}
export const AvatarName: React.FC<AvatarNameProps> = ({ name }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
          <span className="text-white text-sm">
            {name
              .split(' ')
              .slice(0, 2)
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};
