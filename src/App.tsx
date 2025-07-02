import { LatestPhotoCarousel } from "./components/LatestPhotoCarousel";
import { RecentActivities } from "./components/RecentActivities";
import { CollectionsGrid } from "./components/CollectionsGrid";
import { CategoriesDisplay } from "./components/CategoriesDisplay";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <>
      <LatestPhotoCarousel />
      <RecentActivities />
      <CollectionsGrid />
      <CategoriesDisplay />
    </>
  );
}

export default App;
