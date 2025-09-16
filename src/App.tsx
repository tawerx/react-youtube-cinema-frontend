import { Route, Routes } from "react-router-dom";
import { Main } from "./routes/Main";
import { RoomsPage } from "./routes/RoomsPage";
import { Room } from "./routes/Room";
import { CreateRoom } from "./components/CreateRoom";
import CheckRoom from "./middleware/CheckRoom";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/rooms" element={<RoomsPage />}>
        <Route path="create" element={<CreateRoom />} />
      </Route>
      <Route
        path="/rooms/:roomid"
        element={
          <CheckRoom>
            <Room />
          </CheckRoom>
        }
      />
    </Routes>
  );
};
export default App;
