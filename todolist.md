# Todo List

## Tasks

- [ ] Create an optimized cities table
  - [x] Fetch city data from https://public.opendatasoft.com/explore/dataset/geonames-all-cities-with-a-population-1000/api/?disjunctive.cou_name_en&sort=name
  - [x] Display cities in a table format with infinite scroll
  - [x] Include columns for city name, country, timezone, etc.
  - [x] Implement search as you type with autocomplete feature
  - [ ] Implement filter and sorting for each column
  - [x] Clicking on city name should redirect to weather page for that city
  - [ ] Right-clicking on city name should open weather page for that city in a new tab
- [ ] Weather Page
  - [ ] Display weather information using https://openweathermap.org free API
  - [ ] Show current weather (temperature, weather description, humidity, wind speed, atmospheric pressure)
  - [ ] Display forecast (temperature highs and lows, weather descriptions, precipitation chances)
  - [ ] Optional: Display location on map, options for changing unit, etc.
  - [ ] Once weather data is loaded, display basics like day high/low for the city on the cities table page as well
- [ ] Styling
  - [ ] Use appropriate color pallets & styled components for layouts and pages
  - [ ] Implement dynamic backgrounds based on current weather conditions
  - [ ] Use images or animations to represent different weather conditions (e.g., sunny, rainy, cloudy)
- [ ] Responsive Design
  - [ ] Ensure application is responsive and works well on different screen sizes
  - [ ] Implement media queries or responsive design techniques
- [ ] Error Handling
  - [ ] Handle errors gracefully for failed API requests or invalid search queries
  - [ ] Display error messages to users when necessary
- [ ] State Management
  - [ ] Utilize React state management to display data and avoid re-fetching
  - [ ] Manage weather data state centrally and pass down necessary data as props
- [ ] Type Safety
  - [ ] Utilize TypeScript for type safety throughout the application
  - [ ] Define interfaces or types for weather objects and API responses
- [ ] Optional Features
  - [ ] Utilize preferred stack (e.g., Next.js, MST, Tailwind CSS)
  - [ ] Implement geolocation to detect and display weather for user's current location
  - [ ] Maintain history of viewed locations' weather
  - [ ] Provide options to switch between different units of measurement
  - [ ] Add feature to save favorite locations for quick access
- [ ] Deployment
  - [ ] Deploy project with preferred hosting provider (e.g., Netlify, Vercel, GitHub Pages, AWS Amplify, Firebase Hosting)
  - [ ] Create a GitHub repository for the project
  - [ ] Document setup instructions or prerequisites in a README.md file
  - [ ] Ensure code is well-documented and follows best practices
  - [ ] Thoroughly test application to ensure it works as expected
  - [ ] Submit GitHub repository link for evaluation: [Submission Link](https://forms.gle/yPeaPWegqv2Tab829)

## Additional Notes

- You are encouraged to add extra features or enhancements to showcase your skills and creativity
- Consider user experience and accessibility while designing the application
- Make sure to handle edge cases and error scenarios gracefully
