export type colorsTypes =
  | 'red'
  | 'green'
  | 'orange'
  | 'purple'
  | 'blue'
  | 'yellow'
  | 'pink'
  | 'indigo'
  | 'teal'
  | 'cyan'
  | 'gray'
  | 'blueishpink' 
  | 'emerald';

type GradientBackgroundType = {
  colorChosen: colorsTypes;
  animate: boolean;
};

export default function GradientBackground({
  colorChosen,
  animate = false,
}: GradientBackgroundType) {
  const animateClasses = animate ? 'animate-gradient-x bg-[length:200%_200%]' : '';

  switch (colorChosen) {
    case 'blueishpink':
      return `bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 ${animateClasses}`;
    case 'red':
      return `bg-gradient-to-r from-red-500 to-blue-500 ${animateClasses}`;
    case 'green':
      return `bg-gradient-to-r from-green-500 via-green-600 to-green-700 ${animateClasses}`;
    case 'orange':
      return `bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 ${animateClasses}`;
    case 'purple':
      return `bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 ${animateClasses}`;
    case 'blue':
      return `bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 ${animateClasses}`;
    case 'yellow':
      return `bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 ${animateClasses}`;
    case 'pink':
      return `bg-gradient-to-r from-pink-500 via-pink-600 to-pink-700 ${animateClasses}`;
    case 'indigo':
      return `bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 ${animateClasses}`;
    case 'teal':
      return `bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 ${animateClasses}`;
    case 'cyan':
      return `bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 ${animateClasses}`;
    case 'gray':
      return `bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 ${animateClasses}`;
    case 'emerald':
      return `bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 ${animateClasses}`;
    default:
      return `bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 ${animateClasses}`;
  }
}
