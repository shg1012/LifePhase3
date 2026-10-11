// Photo numbers match the order in the supplied collection. Display order mixes
// travel, everyday moments, and work; exact locations are not inferred.
const photos = [
  [9, 'A sunny little detour.', 'Smiling in a blue jacket beside a yellow building and green foliage.', 'THE LITTLE DETOURS', '50% 45%'],
  [1, 'Fresh air. Extra dramatic.', 'Tandem skydiving under a clear blue sky, with an airplane in the distance.', 'A DIFFERENT KIND OF DAY OUT', '65% 55%'],
  [17, 'One for the camera roll.', 'Holding a camera beside the river with the Eiffel Tower behind.', 'CAMERA ALWAYS IN TOW', '45% 45%'],
  [21, 'The scenic route wins.', 'A hiking selfie overlooking a turquoise lake surrounded by mountains and forest.', 'WORTH THE DETOUR', '52% 50%'],
  [13, 'The weekday chapter.', 'Standing and smiling beside the Philips Innovation Campus sign.', 'LIFE BETWEEN ADVENTURES', '57% 43%'],
  [3, 'My kind of museum.', 'Standing with a camera next to a bright green Porsche at a car museum.', 'DESIGN MEETS DAY OUT', '43% 58%'],
  [7, 'Peak happiness.', 'Smiling in sunglasses at a snowy mountain viewpoint with a camera in hand.', 'A LITTLE FRESH PERSPECTIVE', '52% 40%'],
  [11, 'Old-school sweetness.', 'Smiling while holding a large bag of Kismi toffees indoors.', 'THE SMALL JOYS', '60% 42%'],
  [2, 'Window seat, please.', 'Seated in sunglasses and a white shirt, with green trees outside the window.', 'TAKING IT SLOW', '58% 42%'],
  [14, 'Not a bad place to pause.', 'Standing in a mountain meadow with dramatic peaks and clouds behind.', 'TAKING IN THE VIEW', '52% 47%'],
  [16, 'Worth every chilly step.', 'Standing on a snowy mountain trail beneath a pointed, snow-covered peak.', 'OUT OF THE EVERYDAY', '50% 54%'],
  [18, 'Canals and golden light.', 'Holding a camera beside a canal lined with buildings and autumn trees.', 'A WALK WITH THE CAMERA', '48% 42%'],
  [4, 'Cold hands. Good memories.', 'Wearing a winter jacket and beanie at a high viewpoint above city lights.', 'AFTER THE SUN GOES DOWN', '60% 40%'],
  [5, 'A little Eiffel appreciation.', 'Leaning beside a lamp post near the Eiffel Tower in warm sunlight.', 'ANOTHER GOOD WALK', '58% 50%'],
  [6, 'A pause with a grand backdrop.', 'Seated beside an ornate stone fountain, wearing a blue jacket and sunglasses.', 'ANOTHER STOP, ANOTHER STORY', '50% 50%'],
  [8, 'Blue skies, blue jacket.', 'A close-up in reflective sunglasses and a blue jacket against a snowy mountain.', 'OUT IN THE OPEN', '50% 40%'],
  [10, 'Taking the leafy route.', 'Standing beside a car on a quiet lane beneath a canopy of trees.', 'ROOM FOR A LONG DRIVE', '42% 44%'],
  [12, 'Ready for the next turn.', 'Seated in a car, wearing sunglasses and a seat belt.', 'ON THE WAY', '50% 40%'],
  [15, 'Waterfront state of mind.', 'Leaning against a waterfront wall in a blue jacket and sunglasses.', 'A PAUSE BY THE WATER', '65% 42%'],
  [19, 'A familiar name, a new view.', 'Standing outside a Philips building among trees and patches of snow.', 'THE WORK CHAPTER', '48% 50%'],
  [20, 'Occasionally, I clean up.', 'Wearing a blue blazer and white shirt, seated in a car with a seat belt.', 'A CHANGE OF OUTFIT', '50% 40%'],
];

export const galleryPhotos = photos.map(([id, caption, alt, label, position]) => {
  const number = String(id).padStart(2, '0');
  return { id, caption, alt, label, position, type: 'image', src: `assets/photos/photo-${number}.webp`, thumb: `assets/photos/photo-${number}-thumb.webp` };
});
