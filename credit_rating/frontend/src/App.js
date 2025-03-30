import './App.css';
import {Routes, Route} from "react-router-dom";
import MortgageForm from "./components/MortgageForm";
import MortgageList from "./components/MortgageList";
import MortgageEdit from "./components/MortgageEdit";

function App() {
  return (
    <div>
    <Routes>
      <Route path="/" element={<MortgageList />} />
      <Route path="/add" element={<MortgageForm />} />
      <Route path="/edit/:id" element={<MortgageEdit />} />
    </Routes>
    
    </div>
  );
}

export default App;
