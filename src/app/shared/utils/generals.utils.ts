export const getAirQualityText = (value: number) => {
  let text: string = '';

  switch (value) {
    case 1:
      text = 'Good';
      break;
    case 2:
      text = 'Fair';
      break;
    case 3:
      text = 'Moderate';
      break;
    case 4:
      text = 'Poor';
      break;
    case 5:
      text = 'Very Poor';
      break;
    default:
      text = 'Unknown';
      break;
  }

  return text;
};
