import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SplitToEditContainer } from './components/SplitToEdit';


export default function App() {
  return (
    <GestureHandlerRootView>
      <SplitToEditContainer />
    </GestureHandlerRootView >
  );
}
