import { default as React } from 'react';

import { default as Forecast } from 'react-forecast';

require('styles/components/widgets/Weather.scss');

const Weather = ({ latitude, longitude, name }) => <Forecast latitude={latitude} longitude={longitude} name={name} />;

export { Weather };
