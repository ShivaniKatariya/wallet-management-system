import { BrowserRouter, Route, Routes } from "react-router-dom";
import Wallet from "./Wallet/Wallet";
import WalletTransactions from "./WalletTransactions/WalletTransactions";


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Wallet />} />
        <Route path="/transactions" element={<WalletTransactions />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
