interface Props {
  active: boolean;
  direction: 'asc' | 'desc';
}

export default function SortIcon({ active, direction }: Props) {
  return (
    <span className="inline-flex flex-col ml-1 leading-none select-none cursor-pointer">
      <span className={`text-[8px] ${active && direction === 'asc' ? 'text-purple-800' : 'text-gray-300'}`}>▲</span>
      <span className={`text-[8px] ${active && direction === 'desc' ? 'text-purple-800' : 'text-gray-300'}`}>▼</span>
    </span>
  );
}